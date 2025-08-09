import { Controller, Get, Query, Version } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

import { CategoryService } from "./category.service";
import { CategorySwaggerDoc } from "./swagger/category.swagger";

@ApiTags("Category")
@Controller("categories")
export class CategoryController {
	constructor(private categoryService: CategoryService) {}

	@Get("/")
	@Version("1")
	@ApiQuery({ name: "lang", required: false, default: "ru" })
	@ApiOperation({ summary: "Get list of all categories", operationId: "1" })
	@ApiResponse({ status: 200, type: CategorySwaggerDoc, isArray: true })
	allCategories(@Query("lang") lang: string = "ru") {
		return this.categoryService.getAllCategories(lang);
	}

	@Get("/:slug")
	@Version("1")
	@ApiQuery({ name: "slug", required: true, default: "gadgets" })
	@ApiQuery({ name: "lang", required: true, default: "ru" })
	@ApiOperation({ summary: "Get category id by slug", operationId: "2" })
	@ApiResponse({ status: 200, type: CategorySwaggerDoc })
	categoryBySlug(@Query("slug") slug: string, @Query("lang") lang: string) {
		return this.categoryService.getCategoryBySlug(slug, lang);
	}
}
