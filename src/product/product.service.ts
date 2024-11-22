import { Injectable } from "@nestjs/common";
import combineFilters from "utils/combineFilters";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ProductService {
	constructor(private prisma: PrismaService) {}

	async getProductsByCategoryIdV1(
		{ cat_id, page = 1, limit = 5 },
		filters: { [key: string]: string },
	) {
		const test: { [key: string]: string[] } = {
			ram: ["2gb", "3gb", "4gb", "8gb"],
			storage: ["16gb", "128gb"],
		};

		const conditions = combineFilters(test);
		const pageOffset = page > 0 ? limit * (page - 1) : 0;

		const products = await this.prisma.$queryRaw`
			SELECT * FROM "Product" p 
			WHERE p.cat_id = ${Number(cat_id)} 
			${conditions} 
			LIMIT ${Number(limit)} OFFSET ${Number(pageOffset)}`;

		const productsTotal = await this.prisma.$queryRaw`
			SELECT count(p.id)::int FROM "Product" p 
			WHERE p.cat_id = ${Number(cat_id)} 
			${conditions} 
			LIMIT ${Number(limit)} OFFSET ${Number(pageOffset)}`;

		return {
			products,
			meta: {
				total: productsTotal[0].count,
				limit: Number(limit),
				currentPage: Number(page),
				lastPage: Math.ceil(Number(productsTotal[0].count) / Number(limit)),
			},
		};
	}

	//todo
	async getProductsByCategoryIdV2(
		{ cat_id, page = 1, limit = 5 },
		filters: { [key: string]: string },
	) {
		return "get products from elastic";
	}

	async getFacetsByCatIdV1({ cat_id }, filters: { [key: string]: string }) {
		// get all attributes for category id
		const attributes: any = await this.prisma.$queryRaw`
			select attr.*
			from "Product" p
			JOIN "Product_property" pp ON pp.prod_id = p.id
			JOIN "Attribute" attr ON pp.attr_alias = attr.alias
			WHERE p.cat_id = ${Number(cat_id)}
			GROUP BY attr.id`;

		type TOptions = {
			id: Number;
			attr_alias: String;
			option_value: String;
			option_alias: String;
			count: BigInt;
		};

		// get all facets for category id
		const options: TOptions[] = await this.prisma.$queryRaw`
			select
			pp.attr_alias,
			pp.option_value,
			pp.option_alias,
			count(pp.option_value)::int
			from "Product" p
			JOIN "Product_property" pp ON pp.prod_id = p.id
			WHERE p.cat_id = ${Number(cat_id)}
			GROUP by pp.attr_alias, pp.option_value, pp.option_alias`;

		// get map of options arrays
		const optionsMap = new Map();
		for (let o of options) {
			if (!optionsMap.has(o.attr_alias)) {
				optionsMap.set(o.attr_alias, []);
			}
			optionsMap.get(o.attr_alias).push(o);
		}

		// // mapping options list to attribute
		for (let attr of attributes) {
			attr.options = optionsMap.get(attr.alias);
		}

		return attributes;
	}

	//todo
	async getFacetsByCatIdV2({ cat_id }, filters: { [key: string]: string }) {
		return "facets from elastic";
	}

	async getProductById(id: number) {
		return await this.prisma.product.findMany({
			include: { properties: true },
			where: { id },
		});
	}
}
