import { Injectable } from "@nestjs/common";
import { toWhere } from "utils/utils";

import { PrismaService } from "../prisma/prisma.service";
import { ISearchParams } from "./product.types";

// const util = require('util');

@Injectable()
export class ProductService {
	constructor(private prisma: PrismaService) {}

	async getProductsByCatId({ page = 1, limit = 5, cat_id, ...filters }: ISearchParams) {
		const query = toWhere(Number(cat_id), filters);

		const pageOffset = page > 0 ? limit * (page - 1) : 0;

		const [total, data] = await Promise.all([
			this.prisma.product.count({
				where: query,
			}),
			this.prisma.product.findMany({
				where: query,
				take: Number(limit),
				skip: pageOffset,
				include: { images: true },
			}),
		]);

		return {
			data,
			meta: {
				total,
				limit,
				currentPage: page,
				lastPage: Math.ceil(total / limit),
			},
		};
	}

	async getProductById(id: number) {
		return await this.prisma.product.findMany({
			include: { properties: { include: { option: true } } },
			where: { id },
		});
	}
}
