import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Cache } from "cache-manager";

import { CategoryService } from "category/category.service";
import combineFilters from "utils/combineFilters";

import { PrismaService } from "../prisma/prisma.service";
import {
	AttributeType,
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
	async getProductDetails(slug: string, lang: string) {
		const products = await this._getProductBySlug(slug, lang);
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
		const facets: IAttributeMap = await this._getAttributes(categoryId, searchParams.lang);

		const filterableAliases = Object.keys(facets);
		const facetPromises: Promise<ISelectableOption[] | IRangeOption[]>[] = []; // массив промисов для фасетных групп

		for (const alias of filterableAliases) {
			const attribute = facets[alias];

			if (
				attribute.type === AttributeType.STRING ||
				attribute.type === AttributeType.TEXT ||
				attribute.type === AttributeType.NUMBER ||
				attribute.type === AttributeType.BOOLEAN
			) {
				//создаём промис вычисления опций группы
				const promise = (async () => {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					const { [alias]: _excluded, ...restFilters } = filtersBody; // Полуаем фильтры БЕЗ текущего атрибута

					let withFiltersQueryByAlias: Prisma.Sql;
					if (Object.keys(restFilters).length > 0) {
						withFiltersQueryByAlias = await this._withQueryFilters(
							categoryId,
							restFilters,
							searchParams.lang,
						);
					}

					return this._getSelectableOptionsGroup(categoryId, alias, withFiltersQueryByAlias);
				})();

				facetPromises.push(promise);
			}
		}

		// добавляем rangeOptions
		facetPromises.push(this._getRangeOptions(categoryId));

		const results: (ISelectableOption | IRangeOption)[][] = await Promise.all(facetPromises);
		const allOptions: (ISelectableOption | IRangeOption)[] = results.flat();

		// маппинг полученых опций с атрибутами.
		for (const option of allOptions) {
			if (Object.prototype.hasOwnProperty.call(facets, option.alias)) {
				facets[option.alias].options.push(option);
			}
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
	private async _getProductBySlug(slug: string, lang: string): Promise<IProductWithDetails[]> {
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
			WHERE p.slug = ${slug}
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
	private async _getSelectableOptionsGroup(
		categoryId: number,
		alias: string,
		withFiltersQueryByAlias: Prisma.Sql,
	): Promise<ISelectableOption[]> {
		return this.prisma.$queryRaw`
        WITH         
        ${withFiltersQueryByAlias ? Prisma.sql`partial_filters AS (${withFiltersQueryByAlias}),` : Prisma.empty}        
        all_options_for_alias AS ( 
            SELECT p.id, p.properties -> ${alias} AS data
            FROM products p 
            WHERE p.category_id = ${categoryId} 
              AND p.is_active = true
              AND p.properties ? ${alias}
              AND p.properties -> ${alias} IS NOT NULL
              AND p.properties -> ${alias} != 'null'::jsonb
        )
        SELECT 
            ${alias} as alias, 
            ao.data, 
            COUNT(${withFiltersQueryByAlias ? Prisma.sql`pf.id` : Prisma.sql`ao.id`})::int as "amount"
        FROM all_options_for_alias ao
        ${withFiltersQueryByAlias ? Prisma.sql`LEFT JOIN partial_filters pf ON pf.id = ao.id` : Prisma.empty}
        GROUP BY ao.data
        HAVING COUNT(ao.id)::int > 0;
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
