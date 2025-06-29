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

	/**
	 * Метод получения категории
	 * @param slug slug категории
	 * @returns категории
	 */
	async getCategoryBySlug(slug: string): Promise<ICategory> {
		const hashKey = `category::${slug}`;
		const cachedCategory = await this.cacheService.get<ICategory>(hashKey);

		if (cachedCategory) {
			return cachedCategory;
		}

		const category: ICategory = await this.prisma.categories.findFirst({ where: { slug } });
		await this.cacheService.set(hashKey, category, 1000 * 60 * 10);

		return category;
	}
}
