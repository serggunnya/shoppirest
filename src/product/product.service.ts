import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Cache } from "cache-manager";

import { CategoryService } from "category/category.service";
import combineFilters from "utils/combineFilters";

import { PrismaService } from "../prisma/prisma.service";
import {
	IAttribute,
	IAttributeMap,
	IAttributeWithOption,
	IBaseSearchParamsDto,
	IFiltersBodyDto,
	IProduct,
	IProductDetails,
	IProductSearchParams,
	IProductSearchParamsDto,
	IProductsWithMeta,
	IProductWithDetails,
	IRangeOption,
	ISelectableOption,
} from "./interfaces/product.interface";

@Injectable()
export class ProductService {
	constructor(
		private prisma: PrismaService,
		private categoryService: CategoryService,
		@Inject(CACHE_MANAGER) private cacheService: Cache,
	) {}

	//================ Поиск товаров с применением фильтров
	async searchProducts(searchParams: IProductSearchParamsDto, filtersBody: IFiltersBodyDto) {
		const categoryId = await this.categoryService.getCategoryIdBySlug(searchParams.category);

		let withQueryFilters: Prisma.Sql;
		if (Object.keys(filtersBody).length !== 0) {
			withQueryFilters = await this._withQueryFilters(categoryId, filtersBody, searchParams.lang);
		}

		const params = { categoryId, ...searchParams };
		const data = await this._getProducts(params, withQueryFilters);

		const products = data?.length ? data : [];
		const total = data?.length ? products[0].total_count : 0;
		const lastPage = data?.length ? Math.ceil(products[0].total_count / searchParams.limit) : 0;

		const response: IProductsWithMeta = {
			products,
			meta: {
				total,
				limit: searchParams.limit,
				currentPage: searchParams.page,
				lastPage,
			},
		};

		return response;
	}

	//================  Получение товара по идентификатору с деталями
	async getProductDetails(id: number, lang: string) {
		const products = await this._getProductById(id, lang);
		const attributes = await this._getAttributes(products[0].category_id, lang, true);
		const aliases = Object.keys(attributes);

		const details = [];
		for (const alias of aliases) {
			if (alias !== "price") {
				const detail = {
					...products[0].details[alias],
					alias: attributes[alias].alias,
					type: attributes[alias].type,
					name: attributes[alias]?.name,
					description: attributes[alias]?.description,
					display_value: attributes[alias]?.display_value,
					order: attributes[alias].order,
				} as IProductDetails;

				details.push(detail);
			}
		}

		return { ...products[0], details };
	}

	//================  Получает фасеты для фильтра текущей категории
	async getFacets(searchParams: IBaseSearchParamsDto, filtersBody: IFiltersBodyDto) {
		const categoryId = await this.categoryService.getCategoryIdBySlug(searchParams.category);

		let withQueryFilters: Prisma.Sql;
		if (Object.keys(filtersBody).length !== 0) {
			withQueryFilters = await this._withQueryFilters(categoryId, filtersBody, searchParams.lang);
		}

		const facets: IAttributeMap = await this._getAttributes(categoryId, searchParams.lang);

		const options = [
			...(await this._getSelectableOptions(categoryId, withQueryFilters)),
			...(await this._getRangeOptions(categoryId)),
		];

		for (const o of options) {
			facets[o.alias].options.push(o);
		}

		return Object.values(facets);
	}

	//================  Приватный метод для получения запроса с фильтрами
	private async _withQueryFilters(
		categoryId: number,
		filters: IFiltersBodyDto,
		locale: string,
	): Promise<Prisma.Sql> {
		const attributeMap = await this._getAttributes(categoryId, locale);
		return combineFilters(categoryId, filters, attributeMap);
	}

	//================  Приватный метод для получения товара по идентификатору
	private async _getProductById(id: number, lang: string): Promise<IProductWithDetails[]> {
		return await this.prisma.$queryRaw`			
			SELECT p.id, p.category_id, p.slug, p.sku, pt.name, 
				pt.description, p.price, p.discount, 
				p.old_price, p.stock, p.properties as "details",
				json_agg(json_build_object('id', pi.id, 'url', pi.url, 'order', pi.order)) as images,
				COALESCE(AVG(r.rating), 0)::int as "avg_rating",
				COUNT(r.id)::int as "review_count"
			FROM products p			
			LEFT JOIN product_images pi ON pi.product_id = p.id
			LEFT JOIN reviews r ON r.product_id = p.id AND r.is_moderated = true
			LEFT JOIN product_translations pt on pt.product_id = p.id AND pt.locale = ${lang}
			WHERE p.id = ${id}
			GROUP BY p.id, pt.name, pt.description
			`;
	}

	//================  Приватный метод для получения списка товаров
	private async _getProducts(
		searchParams: IProductSearchParams,
		withQueryFilters: Prisma.Sql,
	): Promise<IProduct[]> {
		const { categoryId, page, limit, sortBy, lang } = searchParams;
		const offset = page > 0 ? limit * (page - 1) : 0;

		return await this.prisma.$queryRaw`
			${withQueryFilters ? Prisma.sql`WITH query_filters AS (${withQueryFilters})` : Prisma.empty}
			SELECT p.id, p.category_id, p.slug, p.sku, pt.name, 
				pt.description, p.price, p.discount, 
				p.old_price, p.stock, 
				json_agg(json_build_object('id', pi.id, 'url', pi.url, 'order', pi.order)) as images,
				COALESCE(AVG(r.rating), 0)::int as "avg_rating",
				COUNT(r.id)::int as "review_count",
				COUNT(p.id) OVER()::int as "total_count"
			FROM products p
			${withQueryFilters ? Prisma.sql`JOIN query_filters qf ON qf.id = p.id` : Prisma.empty}
			LEFT JOIN product_images pi ON pi.product_id = p.id
			LEFT JOIN reviews r ON r.product_id = p.id AND r.is_moderated = true
			LEFT JOIN product_translations pt on pt.product_id = p.id AND pt.locale = ${lang}
			WHERE p.category_id = ${categoryId}
			GROUP BY p.id,pt.name, pt.description
			ORDER BY 
				CASE WHEN ${sortBy} = 'price_asc' THEN p.price END ASC,
				CASE WHEN ${sortBy} = 'price_desc' THEN p.price END DESC,
				CASE WHEN ${sortBy} = 'rating' THEN COALESCE(AVG(r.rating), 0) END DESC
			LIMIT ${limit} OFFSET ${offset}
			`;
	}

	//================  Приветный метод для получения аттрибутов
	private async _getAttributes(
		categoryId: number,
		locale: string,
		all: boolean = false,
	): Promise<IAttributeMap> {
		const isFilterable = all ? "all" : "some";
		const hashKey = `${categoryId}::${locale}::${isFilterable}::attributes`;
		const cachedAttributes = await this.cacheService.get<string>(hashKey);

		if (cachedAttributes) {
			return JSON.parse(cachedAttributes) as IAttributeMap;
		}

		const attributes: IAttribute[] = await this.prisma.$queryRaw`
			SELECT distinct on (a.id) 
				a.id, a.alias, a.type, at.name,
				at.description, u.display_value, a.order
				FROM attributes a
				JOIN category_attributes ca ON ca.attribute_id = a.id
				LEFT JOIN attribute_translations at ON at.attribute_id = a.id 
					AND at.locale = ${locale}
				LEFT JOIN attribute_units au ON au.attribute_id = a.id
				LEFT JOIN units u ON u.id = au.unit_id 
					AND u.locale = ${locale}
				WHERE ca.category_id = ${categoryId} 
				${!all ? Prisma.sql`AND a.is_filterable = true` : Prisma.empty}
				group by a.id, at.name, 
					at.description, u.display_value
			`;

		const attributesMap: IAttributeMap = {};
		for (const attr of attributes) {
			const attrWithOptions: IAttributeWithOption = { ...attr, options: [] };
			attributesMap[attr.alias] = attrWithOptions;
		}

		await this.cacheService.set(hashKey, JSON.stringify(attributesMap), 1000 * 60 * 10);

		return attributesMap;
	}

	//================  Приватный метод для получения отмечаемых опций аттрибутов
	private async _getSelectableOptions(
		categoryId: number,
		withQueryFilters: Prisma.Sql,
	): Promise<ISelectableOption[]> {
		return this.prisma.$queryRaw`
        WITH ${
					withQueryFilters ? Prisma.sql`query_filters AS (${withQueryFilters}),` : Prisma.empty
				}        
        selectable_options AS ( 
          SELECT p.id, 
          (jsonb_each(p.properties)).key AS alias, 
          (jsonb_each(p.properties)).value AS data 
          FROM products p 
          WHERE p.category_id = ${categoryId} AND p.is_active = true 
        )
        SELECT so.alias, so.data, 
        COUNT(${withQueryFilters ? Prisma.sql`qf.id` : Prisma.sql`so.id`})::int as "amount" 
        FROM selectable_options so 
        JOIN attributes a ON so.alias = a.alias
        ${withQueryFilters ? Prisma.sql`LEFT JOIN query_filters qf ON qf.id = so.id` : Prisma.empty}
        WHERE a.is_filterable = true 
        AND a.type IN ('STRING', 'TEXT', 'NUMBER', 'BOOLEAN') 
        AND so.data IS NOT NULL 
        AND so.data::text != 'null'
        GROUP BY so.alias, so.data 
        HAVING COUNT(so.id)::int > 0 
      `;
	}

	//================  Приватный метод для получения опций аттрибутов с диапазоном значений
	private async _getRangeOptions(categoryId: number): Promise<IRangeOption[]> {
		const cachedOptions = await this.cacheService.get<IRangeOption[]>(`${categoryId}::ranges`);

		if (cachedOptions) {
			return cachedOptions;
		}

		const numericOptions: IRangeOption[] = await this.prisma.$queryRaw`
			SELECT ranges.alias,
				jsonb_build_object(
					'min', MIN(ranges.value),
					'max', MAX(ranges.value)
				) AS data
			FROM products p, LATERAL (
					SELECT 'price' as alias, p.price as value
					WHERE p.price > 0
					UNION ALL
					SELECT a.alias,
						(p.properties -> a.alias ->> 'value')::numeric
					from "attributes" a
					where a.type = 'NUMERIC'
						AND a.is_filterable = true
						AND p.properties ? a.alias
				) AS ranges
			WHERE p.is_active = true AND p.category_id = ${categoryId}
			GROUP by ranges.alias;
		`;

		await this.cacheService.set(`${categoryId}::ranges`, numericOptions, 1000 * 60 * 10);

		return numericOptions;
	}
}
