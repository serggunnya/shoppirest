import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";

import { PrismaService } from "../prisma/prisma.service";
import { ICategory } from "./interfaces/category.interface";

@Injectable()
export class CategoryService {
	constructor(
		private prisma: PrismaService,
		@Inject(CACHE_MANAGER) private cacheService: Cache,
	) {}

	/**
	 * Метод получения категорий
	 * @param locale язык перевода
	 * @returns категории
	 */
	async getAllCategories(locale: string): Promise<ICategory[]> {
		return await this.prisma.$queryRaw`
			select 
				c.id, c.slug, ct."name", ct.description, 
				c.image, c.parent_id from categories c 
			join category_translations ct on ct.category_id = c.id
			where ct.locale = ${locale}
		`;
	}
}
