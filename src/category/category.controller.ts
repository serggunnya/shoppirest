import { Controller, Get, Version } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { CategoryService } from "./category.service";
import { CategorySwaggerDoc } from "./swagger/category.swagger";

@ApiTags("Category")
@Controller("categories")
export class CategoryController {
	constructor(private categoryService: CategoryService) {}

	@Get("/")
	@Version("1")
	@ApiOperation({ summary: "Get list of all categories", operationId: "1" })
	@ApiResponse({ status: 200, type: CategorySwaggerDoc, isArray: true })
	allCategories() {
		return this.categoryService.getAllCategories();
	}
}
