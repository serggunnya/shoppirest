import { Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CategoryService {
	constructor(private prisma: PrismaService) {}

	/**
	 * Метод получения категорий
	 * @param locale язык перевода
	 * @returns категории
	 */
	async getAllCategories(locale: string) {
		return await this.prisma.$queryRaw`
			select 
				c.id, c.slug, ct."name", ct.description, 
				c.image, c.parent_id from categories c 
			join category_translations ct on ct.category_id = c.id
			where ct.locale = ${locale}
		`;
	}
}
