import { Controller, Get, NotFoundException, Param, Query, Version } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

import { CategoryService } from "./category.service";
import { CategoryDataResponseDoc, CategoryDoc } from "./swagger/category.swagger";

@ApiTags("Category")
@Controller("categories")
export class CategoryController {
	constructor(private categoryService: CategoryService) {}

	@Get("/")
	@Version("1")
	@ApiQuery({ name: "lang", required: false, default: "ru" })
	@ApiOperation({ summary: "Get list of all categories" })
	@ApiResponse({ status: 200, type: CategoryDoc, isArray: true })
	@ApiResponse({ status: 400, description: "Bad request" })
	@ApiResponse({ status: 404, description: "Categories not found" })
	async allCategories(@Query("lang") lang: string = "ru") {
		const categories = await this.categoryService.getAllCategories(lang);
		if (!categories.length) {
			throw new NotFoundException("No categories found");
		}
		return categories;
	}

	@Get(":slug")
	@Version("1")
	@ApiParam({ name: "slug", required: true })
	@ApiQuery({ name: "lang", required: true, default: "ru" })
	@ApiOperation({ summary: "Get category by slug" })
	@ApiResponse({ status: 200, type: CategoryDataResponseDoc })
	@ApiResponse({ status: 400, description: "Bad request" })
	@ApiResponse({ status: 404, description: "Category not found" })
	async categoryBySlug(@Param("slug") slug: string, @Query("lang") lang: string) {
		const category = await this.categoryService.getCategoryDataBySlug(slug, lang);
    if (!category) {
        throw new NotFoundException(`Category with slug "${slug}" not found`);
    }
    return category;
	}
}
