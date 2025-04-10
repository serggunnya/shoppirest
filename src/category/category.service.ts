import { Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class CategoryService {
	constructor(private prisma: PrismaService) {}

	/**
	 * Метод получения категорий
	 * @returns категории
	 */
	async getAllCategories() {
		return await this.prisma.categories.findMany();
	}
}
