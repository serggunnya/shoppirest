import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Cache } from "cache-manager";
import combineFilters from "utils/combineFilters";

import { PrismaService } from "../prisma/prisma.service";
import {
	IAttribute,
	IAttributeMap,
	IAttributeWithOption,
	IProduct,
	IProductsWithMeta,
	IRangeOption,
	ISearchFilters,
	ISearchParams,
	ISelectableOption,
} from "./interfaces/product.interface";

var hash = require("object-hash");

@Injectable()
export class ProductService {
	constructor(
		private prisma: PrismaService,
		@Inject(CACHE_MANAGER) private cacheService: Cache,
	) {}

	/**
	 * Поиск товаров с применением фильтров
	 * @param searchParams Параметры поиска
	 * @param searchFilters Фильтры поиска
	 * @returns Товары с метаданными для пагинации
	 */
	async searchProducts(searchParams: ISearchParams, searchFilters: ISearchFilters) {
		let withQueryFilters: Prisma.Sql;
		if (Object.keys(searchFilters).length !== 0) {
			withQueryFilters = await this._withQueryFilters(
				searchParams.category,
				searchFilters,
				searchParams.lang,
			);
		}

		const [products, total] = await Promise.all([
			this._getProducts(searchParams, withQueryFilters),
			this._getProductsCount(searchParams.category, withQueryFilters),
		]);

		return {
			products,
			meta: {
				total: total[0].count,
				limit: searchParams.limit,
				currentPage: searchParams.page,
				lastPage: Math.ceil(total[0].count / searchParams.limit),
			},
		} as IProductsWithMeta;
	}

	/**
	 * Получение товара по идентификатору с деталями
	 * @param id Идентификатор товара
	 * @param lang Язык
	 * @returns Товар с деталями
	 */
	async getProductDetails(id: number, lang: string) {
		const product = await this._getProductById(id, lang);
		const attributes = await this._getAttributes(product[0].category_id, lang, true);
		const keys = Object.keys(attributes);

		const details = [];
		for (let k of keys) {
			if (k !== "price") {
				const prop = {
					...product[0].details[k],
					alias: attributes[k].alias,
					type: attributes[k].type,
					name: attributes[k]?.name,
					description: attributes[k]?.description,
					display_value: attributes[k]?.display_value,
					order: attributes[k].order,
				};
				details.push(prop);
			}
		}

		return { ...product[0], details };
	}

	/**
	 * Получает фасеты для фильтра текущей категории
	 * @param categoryId Идентификатор категории
	 * @param searchFilters Фильтры поиска
	 * @param locale Язык
	 * @returns Фасеты для фильтра
	 */
	async getFacets(categoryId: number, searchFilters: ISearchFilters, locale: string) {
		let withQueryFilters: Prisma.Sql;
		if (Object.keys(searchFilters).length !== 0) {
			withQueryFilters = await this._withQueryFilters(categoryId, searchFilters, locale);
		}

		const facets: IAttributeMap = await this._getAttributes(categoryId, locale);

		const options = [
			...(await this._getSelectableOptions(categoryId, withQueryFilters)),
			...(await this._getRangeOptions(categoryId)),
		];

		for (let o of options) {
			facets[o.alias].options.push(o);
		}

		return Object.values(facets);
	}

	/**
	 * Приватный метод для получения запроса с фильтрами
	 * @param categoryId Идентификатор категории
	 * @param filters Фильтры поиска
	 * @param locale Язык
	 * @returns Запрос с фильтрами (кешируется)
	 */
	private async _withQueryFilters(
		categoryId: number,
		filters: ISearchFilters,
		locale: string,
	): Promise<Prisma.Sql> {
		const hashKey = hash(filters);
		const withQueryCached: Prisma.Sql = await this.cacheService.get<Prisma.Sql>(hashKey);

		if (withQueryCached) {
			return withQueryCached;
		}

		const attributeMap = await this._getAttributes(categoryId, locale);
		const withQueryFilters = combineFilters(categoryId, filters, attributeMap);

		await this.cacheService.set(hashKey, withQueryFilters, 1000 * 60 * 10);
		return withQueryFilters;
	}

	/**
	 * Приватный метод для получения товара по идентификатору
	 * @param id Идентификатор товара
	 * @param lang Язык
	 * @returns Товар
	 */
	private async _getProductById(id: number, lang: string) {
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

	/**
	 * Приватный метод для получения списка товаров
	 * @param searchParams Параметры поиска
	 * @param withQueryFilters Запрос с фильтрами
	 * @returns Товары
	 */
	private async _getProducts(
		searchParams: ISearchParams,
		withQueryFilters: Prisma.Sql,
	): Promise<IProduct[]> {
		const { category, page, limit, sortBy, lang } = searchParams;
		const offset = page > 0 ? limit * (page - 1) : 0;

		return await this.prisma.$queryRaw`
			${withQueryFilters ? Prisma.sql`WITH query_filters AS (${withQueryFilters})` : Prisma.empty}
			SELECT p.id, p.category_id, p.slug, p.sku, pt.name, 
				pt.description, p.price, p.discount, 
				p.old_price, p.stock, 
				json_agg(json_build_object('id', pi.id, 'url', pi.url, 'order', pi.order)) as images,
				COALESCE(AVG(r.rating), 0)::int as "avg_rating",
				COUNT(r.id)::int as "review_count"
			FROM products p
			${withQueryFilters ? Prisma.sql`JOIN query_filters qf ON qf.id = p.id` : Prisma.empty}
			LEFT JOIN product_images pi ON pi.product_id = p.id
			LEFT JOIN reviews r ON r.product_id = p.id AND r.is_moderated = true
			LEFT JOIN product_translations pt on pt.product_id = p.id AND pt.locale = ${lang}
			WHERE p.category_id = ${category}
			GROUP BY p.id,pt.name, pt.description
			ORDER BY 
				CASE WHEN ${sortBy} = 'price_asc' THEN p.price END ASC,
				CASE WHEN ${sortBy} = 'price_desc' THEN p.price END DESC,
				CASE WHEN ${sortBy} = 'rating' THEN COALESCE(AVG(r.rating), 0) END DESC
			LIMIT ${limit} OFFSET ${offset}
			`;
	}

	/**
	 * Приватный метод для получения количества товаров
	 * @param categoryId Идентификатор категории
	 * @param withQueryFilters Запрос с фильтрами
	 * @returns Количество товаров
	 */
	private async _getProductsCount(
		categoryId: number,
		withQueryFilters: Prisma.Sql,
	): Promise<{ count: number }[]> {
		if (withQueryFilters !== undefined) {
			return await this.prisma.$queryRaw`select count(id)::int from (${withQueryFilters}) as c`;
		}

		return await this.prisma.$queryRaw`
			select count(id)::int from "products" p where p.category_id = ${categoryId}
		`;
	}

	/**
	 * Приветный метод для получения аттрибутов
	 * @param categoryId Идентификатор категории
	 * @param locale Язык
	 * @param all Все аттрибуты (плюс не фильтруемые)
	 * @returns Атрибуты (кешируются)
	 */
	private async _getAttributes(
		categoryId: number,
		locale: string,
		all: boolean = false,
	): Promise<IAttributeMap> {
		const isFilterable = all ? "all" : "some";
		const hashKey = `${categoryId}::${locale}::${isFilterable}::attributes`;
		const cachedAttributes = await this.cacheService.get<IAttributeMap>(hashKey);

		if (cachedAttributes) {
			return cachedAttributes;
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
		for (let attr of attributes) {
			const attrWithOptions: IAttributeWithOption = { ...attr, options: [] };
			attributesMap[attr.alias] = attrWithOptions;
		}

		await this.cacheService.set(hashKey, attributesMap, 1000 * 60 * 10);

		return attributesMap;
	}

	/**
	 * Приватный метод для получения отмечаемых опций аттрибутов
	 * @param categoryId Идентификатор категории
	 * @param withQueryFilters Запрос с фильтрами
	 * @returns Опции аттрибутов
	 */
	private async _getSelectableOptions(
		categoryId: number,
		withQueryFilters: Prisma.Sql,
	): Promise<ISelectableOption[]> {
		return this.prisma.$queryRaw`
				WITH ${withQueryFilters ? Prisma.sql`query_filters AS (${withQueryFilters}),` : Prisma.empty}
				selectable_options AS (
					SELECT a.alias, p.id, 
					p.properties-> a.alias as data
					FROM products p
					CROSS JOIN attributes a
					WHERE p.category_id= ${categoryId}
						AND p.is_active = true
						AND a.type IN ('STRING','TEXT','NUMBER', 'BOOLEAN')
						AND a.is_filterable = true 						
						AND p.properties ? a.alias
				)
				SELECT so.alias, so.data, COUNT(${
					withQueryFilters ? Prisma.sql`qf.id` : Prisma.sql`*`
				})::int as "amount"
				FROM selectable_options so
				${withQueryFilters ? Prisma.sql`LEFT JOIN query_filters qf ON qf.id = so.id` : Prisma.empty}
				WHERE so.data IS NOT NULL
				GROUP BY so.alias, so.data
				HAVING COUNT(*)::int > 0
				`;
	}

	/**
	 * Приватный метод для получения опций аттрибутов с диапазоном значений
	 * @param categoryId Идентификатор категории
	 * @returns Опции аттрибутов (кешируются)
	 */
	private async _getRangeOptions(categoryId: number): Promise<IRangeOption[]> {
		const cachedOptions = await this.cacheService.get<IRangeOption[]>(`${categoryId}::ranges`);

		if (cachedOptions) {
			return cachedOptions;
		}

		const numericOptions: IRangeOption[] = await this.prisma.$queryRaw`
			WITH numeric_options AS (
				SELECT a.alias,
					(p.properties->a.alias->>'value')::numeric as value
				FROM products p
				CROSS JOIN "attributes" a
				WHERE p.category_id = ${categoryId}
					AND p.is_active = true
					AND a.type IN ('NUMERIC')
					AND a.is_filterable = true 
					AND p.properties ? a.alias    
			),
			price_option AS (
				SELECT 'price' as alias, price::numeric as value
				FROM products WHERE category_id = ${categoryId}
					AND is_active = true AND price > 0
			)
			SELECT alias, 
			jsonb_build_object('value', 
				jsonb_build_object('min',MIN(value),'max', MAX(value)) 
			) as data
			FROM (
				SELECT * FROM numeric_options
				UNION ALL
				SELECT * FROM price_option
			) combined
			GROUP BY alias
			`;

		await this.cacheService.set(`${categoryId}::ranges`, numericOptions, 1000 * 60 * 10);

		return numericOptions;
	}
}
