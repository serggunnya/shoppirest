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

	// Метод получения категорий
	async getAllCategories(locale: string): Promise<ICategory[]> {
		return await this.prisma.$queryRaw`
			select 
				c.id, c.slug, ct."name", ct.description, 
				c.image, c.parent_id from categories c 
			join category_translations ct on ct.category_id = c.id
			where ct.locale = ${locale}
		`;
	}

	// Метод получения категории по слагу
	async getCategoryIdBySlug(slug: string): Promise<number> {
		const cacheKey = `category:${slug}`;
		const cachedCategory = await this.cacheService.get<number>(cacheKey);

		if (cachedCategory) {
			return cachedCategory;
		}

		const cache_ttl = 1000 * 60 * 10;
		const category = await this.prisma.categories.findFirst({ where: { slug } });
		await this.cacheService.set(cacheKey, category.id, cache_ttl);

		return category.id;
	}
}
