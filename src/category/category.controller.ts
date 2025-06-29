import { Controller, Get, Param, Query, Version } from "@nestjs/common";
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

	@Get("/slug")
	@Version("1")
	@ApiOperation({ summary: "Get list of all categories", operationId: "1" })
	@ApiResponse({ status: 200, type: CategorySwaggerDoc, isArray: false })
	getCategoryBySlug(@Param("slug") slug: string) {
		return this.categoryService.getCategoryBySlug(slug);
	}
}
