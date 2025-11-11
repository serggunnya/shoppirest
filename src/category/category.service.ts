import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { Cache } from "cache-manager";

import { PrismaService } from "../prisma/prisma.service";
import { Category, CategoryExtended, CategoryResponse } from "./interfaces/category.interface";

@Injectable()
export class CategoryService {
	constructor(
		private prisma: PrismaService,
		@Inject(CACHE_MANAGER) private cacheService: Cache,
	) {}

	// ---------- Метод получения категорий
	async getAllCategories(locale: string): Promise<Category[]> {
		return await this.prisma.$queryRaw`
			select 
				c.id, c.slug, ct."name", ct.description, 
				c.image, c.parent_id from categories c 
			join category_translations ct on ct.category_id = c.id
			where ct.locale = ${locale}
		`;
	}

	// ---------- Метод получения данных категории по slug
	async getCategoryDataBySlug(slug: string, lang: string): Promise<CategoryResponse> {
		// Проверяем кэш
		const cacheKey = `category:${slug}:${lang}`;
		const cachedCategoryResonse = await this.cacheService.get<string>(cacheKey);

		if (cachedCategoryResonse) {			
			return JSON.parse(cachedCategoryResonse) as CategoryResponse;
		}

		// Получаем ветку категорий
		const categoryBranch: CategoryExtended[]  = await this._getRawCategoryBranch(slug, lang);
		
		const selfCategory = categoryBranch.find(cat => cat.type === 'self');
		if (!selfCategory) {
			return null;
		}

		const breadcrumbs = categoryBranch
			.filter(cat => cat.type === 'ancestor')
			.sort((a, b) => (b.level!- a.level!));

		const children = categoryBranch.filter(cat => cat.type === 'child');

		// Формируем ответ
		const categoryResonse: CategoryResponse = {
			...selfCategory,
			breadcrumbs,
			children,
		};

		// Сохраняем в кэш ветку категорий
		const cache_ttl = 1000 * 60 * 10;
		await this.cacheService.set(cacheKey,JSON.stringify(categoryResonse), cache_ttl);

		return categoryResonse;		
	}

	// ---------- приватный метод получения ветки категорий (предки, текущая, дети)
	private async _getRawCategoryBranch(slug:string, lang:string): Promise<CategoryExtended[]> {	
		const queryRaw = Prisma.sql`
				WITH RECURSIVE 
					Ancestors AS (
							SELECT 
									c.id, c.slug, c.parent_id, 
									ct.name, ct.description, 
									0 as level -- Уровень вложенности, 0 для стартовой
							FROM categories c
							JOIN category_translations ct ON ct.category_id = c.id AND ct.locale = ${lang}
							WHERE c.is_active = TRUE AND c.slug = ${slug}
							UNION ALL
							SELECT 
									c.id, c.slug, c.parent_id, 
									ct.name, ct.description, 
									a.level + 1 as level
							FROM categories c
							JOIN category_translations ct ON ct.category_id = c.id AND ct.locale = ${lang}
							JOIN Ancestors a ON c.id = a.parent_id -- Присоединяем родителя из предыдущего шага
							WHERE c.is_active = TRUE
					),
					Children AS (
							SELECT 
									c.id, c.slug, c.parent_id, 
									ct.name, ct.description
							FROM categories c
							JOIN category_translations ct ON ct.category_id = c.id AND ct.locale = ${lang}
							WHERE c.is_active = TRUE AND c.parent_id = (SELECT id FROM categories WHERE slug = ${slug})
					)
				SELECT id, slug, parent_id, name, description, level, 'self' as type 
				FROM Ancestors WHERE level = 0 -- Сама категория
				UNION ALL
				SELECT id, slug, parent_id, name, description, level, 'ancestor' as type 
				FROM Ancestors WHERE level > 0 -- Ее предки
				UNION ALL
				SELECT id, slug, parent_id, name, description, NULL as level, 'child' as type 
				FROM Children; -- Ее дети
		`
		return await this.prisma.$queryRaw(queryRaw)
	}
}
