import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Cache } from "cache-manager";

import { PrismaService } from "../prisma/prisma.service";
import { Category } from "./interfaces/category.interface";

@Injectable()
export class CategoryService {
	constructor(
		private prisma: PrismaService,
		@Inject(CACHE_MANAGER) private cacheService: Cache,
	) {}

	// Метод получения категорий
	async getAllCategories(locale: string): Promise<Category[]> {
		return await this.prisma.$queryRaw`
			select 
				c.id, c.slug, ct."name", ct.description, 
				c.image, c.parent_id from categories c 
			join category_translations ct on ct.category_id = c.id
			where ct.locale = ${locale}
		`;
	}

	// Метод получения категории по слагу
	async getCategoryBySlug(slug: string, lang: string): Promise<Category> {
		const cacheKey = `category:${slug}:${lang}`;
		const cachedCategory = await this.cacheService.get<Category>(cacheKey);

		if (cachedCategory) {
			return cachedCategory;
		}

		const baseQueryRaw = Prisma.sql`
        WITH RECURSIVE CategoryWithTranslation AS (
            -- Базовая часть: находим основную категорию по slug
            SELECT c.*, ct.name, ct.description
            FROM categories c
            JOIN category_translations ct ON ct.category_id = c.id AND ct.locale = ${lang}
            WHERE c.is_active = TRUE AND c.slug = ${slug}
            UNION ALL
            -- Рекурсивная часть: находим прямых потомков категории
            SELECT c_child.*, ct_child.name, ct_child.description
            FROM categories c_child
            JOIN category_translations ct_child ON ct_child.category_id = c_child.id AND ct_child.locale = ${lang}
            JOIN CategoryWithTranslation p ON c_child.parent_id = p.id
            WHERE c_child.is_active = TRUE
        )
        SELECT * FROM CategoryWithTranslation;
    `;

		const categoriesAndChildren: Category[] = await this.prisma.$queryRaw(baseQueryRaw);

		if (categoriesAndChildren.length === 0) {
			return null;
		}

		// Находим родительскую категорию
		const parentCategory = categoriesAndChildren.find((c) => c.slug === slug);

		if (!parentCategory) {
			return null;
		}

		// Находим дочерние категории
		const childrenCategories = categoriesAndChildren.filter((c) => c.id !== parentCategory.id);

		parentCategory.children = childrenCategories;

		const cache_ttl = 1000 * 60 * 10;
		await this.cacheService.set(cacheKey, parentCategory, cache_ttl);

		return parentCategory;
	}
}
