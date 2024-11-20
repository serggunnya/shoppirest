import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

import { CategoryService } from "./category.service";
import { CategoryEntity } from "./category.types";

@ApiTags("Category")
@Controller("categories")
export class CategoryController {
	constructor(private categoryService: CategoryService) {}

	@Get("/")
	@ApiOkResponse({ type: CategoryEntity, isArray: true })
	allCategories() {
		return this.categoryService.getAllCategories();
	}
}
