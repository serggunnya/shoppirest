import { Controller, Get, Version } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { CategoryService } from "./category.service";
import { CategorySwaggerDoc } from "./swagger/category.swagger";

@ApiTags("Category")
@Controller("categories")
export class CategoryController {
	constructor(private categoryService: CategoryService) {}

	@Get("/")
	@Version("1")
	@ApiOkResponse({ status: 200, type: CategorySwaggerDoc, isArray: true })
	@ApiOperation({ summary: "Get list of all categories", operationId: "1" })
	allCategories() {
		return this.categoryService.getAllCategories();
	}
}
