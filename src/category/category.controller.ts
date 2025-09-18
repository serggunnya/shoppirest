import { Controller, Get, Param, Query, Version } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

import { CategoryService } from "./category.service";
import { CategorySwaggerDoc } from "./swagger/category.swagger";

@ApiTags("Category")
@Controller("categories")
export class CategoryController {
	constructor(private categoryService: CategoryService) {}

	@Get("/")
	@Version("1")
	@ApiQuery({ name: "lang", required: false, default: "ru" })
	@ApiOperation({ summary: "Get list of all categories" })
	@ApiResponse({ status: 200, type: CategorySwaggerDoc, isArray: true })
	@ApiResponse({ status: 400, description: "Bad request" })
	allCategories(@Query("lang") lang: string = "ru") {
		return this.categoryService.getAllCategories(lang);
	}

	@Get(":slug")
	@Version("1")
	@ApiParam({ name: "slug", required: true })
	@ApiQuery({ name: "lang", required: true, default: "ru" })
	@ApiOperation({ summary: "Get category by slug" })
	@ApiResponse({ status: 200, type: CategorySwaggerDoc })
	@ApiResponse({ status: 404, description: "Category not found" })
	@ApiResponse({ status: 400, description: "Bad request" })
	categoryBySlug(@Param("slug") slug: string, @Query("lang") lang: string) {
		return this.categoryService.getCategoryBySlug(slug, lang);
	}
}
