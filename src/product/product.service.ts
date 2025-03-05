import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Cache } from "cache-manager";
import combineFilters from "utils/combineFilters";

import { PrismaService } from "../prisma/prisma.service";
import {
	IAttributeEntity,
	IFacetsResponse,
	INumericOptionEntity,
	IProductEntity,
	IProductsResponse,
	ITextOptionEntity,
} from "./product.types";

var hash = require("object-hash");

@Injectable()
export class ProductService {
	constructor(private prisma: PrismaService, @Inject(CACHE_MANAGER) private cacheService: Cache) {}

	//---------------------------------------------------------------------------
	async getProductsByCategoryIdV1(
		{ cat_id, page = 1, limit = 5 },
		filters: { [key: string]: any },
	) {
		let withFilters: Prisma.Sql;
		if (Object.keys(filters).length !== 0) {
			withFilters = await this._withFilters(Number(cat_id), filters);
		}

		const offset = page > 0 ? Number(limit) * (page - 1) : 0;

		const [products, total] = await Promise.all([
			this._getProducts(Number(cat_id), withFilters, offset, Number(limit)),
			this._getProductsCount(Number(cat_id), withFilters),
		]);

		return {
			products,
			meta: {
				total: total[0].count,
				limit: Number(limit),
				currentPage: Number(page),
				lastPage: Math.ceil(total[0].count / Number(limit)),
			},
		} as IProductsResponse;
	}

	//---------------------------------------------------------------------------

	async getFacetsByCategoryIdV1({ cat_id }, filters: { [key: string]: any }) {
		let withFilters: Prisma.Sql;
		if (Object.keys(filters).length !== 0) {
			withFilters = await this._withFilters(Number(cat_id), filters);
		}

		const attributes = await this._getAttributes(Number(cat_id));

		attributes.push({
			id: 0,
			name: "Цена",
			alias: "price",
			type: 1,
			createdAt: new Date(),
		});

		const options = [
			...(await this._getTextOptions(Number(cat_id), withFilters)),
			...(await this._getNumericOptions(Number(cat_id))),
		];

		const attrMap = new Map();
		for (let attr of attributes) {
			(attr as IFacetsResponse).options = [];
			attrMap.set(attr.alias, attr);
		}

		for (let opt of options) {
			attrMap.get(opt.alias).options.push(opt);
		}

		return attributes as IFacetsResponse[];
	}

	//---------------------------------------------------------------------------
	async getProductById(id: number) {
		return await this.prisma.product.findMany({ where: { id } });
	}

	//---------------------------------------------------------------------------
	async _getAttributes(cat_id: number): Promise<IAttributeEntity[]> {
		const cachedAttributes = await this.cacheService.get<IAttributeEntity[]>(
			`${cat_id}::attributes`,
		);

		if (cachedAttributes) {
			return cachedAttributes;
		}

		const attributes: IAttributeEntity[] = await this.prisma.$queryRaw`
			SELECT a.* FROM "Attribute" a
			JOIN "Category_attribute" ca on ca.attribute_id = a.id
			where ca.category_id = ${cat_id} GROUP BY a.id
			`;

		await this.cacheService.set(`${cat_id}::attributes`, attributes, 1000 * 60 * 10);

		return attributes;
	}

	//---------------------------------------------------------------------------
	async _getTextOptions(cat_id: number, withFilters): Promise<ITextOptionEntity[]> {
		if (withFilters !== undefined) {
			return this.prisma.$queryRaw`
				WITH ids AS (${withFilters})
				SELECT a.id, p.* FROM (
					SELECT "alias", "value", COUNT(CASE WHEN p.id = ids.id THEN 1 END)::int
					FROM "Product" p
					JOIN LATERAL jsonb_each_text(p.properties) AS attr("alias") ON TRUE
					LEFT JOIN ids ON p.id = ids.id
					where p.cat_id = ${cat_id} 
					GROUP BY alias, value
				) AS p
				JOIN "Attribute" a ON p.alias = a.alias AND a."type" in (0,1);
				`;
		}

		return this.prisma.$queryRaw`			
			SELECT a.id, p.* FROM (
    		SELECT "alias", "value", COUNT(p.id)::int
    		FROM "Product" p
    		JOIN LATERAL jsonb_each_text(p.properties) AS attr("alias") ON TRUE    		
    		where p.cat_id = ${cat_id} 
    		GROUP BY alias, value
			) AS p
			JOIN "Attribute" a ON p.alias = a.alias AND a."type" in (0,1);
			`;
	}

	//---------------------------------------------------------------------------
	async _getNumericOptions(cat_id: number): Promise<INumericOptionEntity[]> {
		const cachedOptions = await this.cacheService.get<INumericOptionEntity[]>(`${cat_id}::ranges`);

		if (cachedOptions) {
			return cachedOptions;
		}

		const numericOptions: INumericOptionEntity[] = await this.prisma.$queryRaw`
			select a.id, p.alias, min(p.value), max(p.value) from (
				select "alias", "value"    
				FROM "Product" p, jsonb_each_text(p.properties) as attr("alias")
				where p.cat_id = ${cat_id}
				GROUP by alias, value
			) as p
			join "Attribute" a on p.alias = p.alias
			and a.alias = p.alias and a."type" in (2,3)
			group by p.alias, a.id
			union			
			select 0 as id, 'price' as "alias", min(p.price)::text, max(p.price)::text price 
			from "Product" p where p.cat_id = ${cat_id}
			`;

		await this.cacheService.set(`${cat_id}::ranges`, numericOptions, 1000 * 60 * 10);

		return numericOptions;
	}

	//---------------------------------------------------------------------------
	async _withFilters(cat_id: number, filters: { [key: string]: any }): Promise<Prisma.Sql> {
		const hashKey = hash(filters);
		const withIdsCached: Prisma.Sql = await this.cacheService.get<Prisma.Sql>(hashKey);

		if (withIdsCached) {
			return withIdsCached;
		}

		const withIds = combineFilters(cat_id, filters);
		await this.cacheService.set(hashKey, withIds, 1000 * 60 * 10);
		return withIds;
	}

	//---------------------------------------------------------------------------
	async _getProducts(cat_id: number, withFilters, offset, limit): Promise<IProductEntity[]> {
		if (withFilters !== undefined) {
			return await this.prisma.$queryRaw`
				WITH ids AS (${withFilters})
				select * from "Product" p 
				join ids on ids.id = p.id
				where p.cat_id = ${cat_id}
				limit ${limit} offset ${offset}
				`;
		}

		return await this.prisma.$queryRaw`			
			select * from "Product" p 
			where p.cat_id = ${cat_id}
			limit ${limit} offset ${offset}
			`;
	}

	//---------------------------------------------------------------------------
	async _getProductsCount(cat_id: number, withFilters): Promise<{ count: number }[]> {
		if (withFilters !== undefined) {
			return await this.prisma.$queryRaw`select count(id)::int from (${withFilters}) as pp`;
		}

		return await this.prisma.$queryRaw`
			select count(id)::int from "Product" p where p.cat_id = ${cat_id}
		`;
	}
}
