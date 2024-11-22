import { Body, Controller, Get, Param, Query, Version } from "@nestjs/common";
import { ParseIntPipe } from "@nestjs/common/pipes";
import { ApiOkResponse, ApiParam, ApiTags } from "@nestjs/swagger";

import { ProductEntity } from "./ProductEntity";
import { ProductService } from "./product.service";
import { IProductParams } from "./product.types";

@ApiTags("Products")
@Controller("products")
export class ProductController {
	constructor(private productService: ProductService) {}

	@Version("1")
	@Get("/")
	@ApiOkResponse({ type: ProductEntity, isArray: true })
	getProductsByCategoryIdV1(
		@Query() params: IProductParams,
		@Body() filters: { [key: string]: string },
	) {
		return this.productService.getProductsByCategoryIdV1(params, filters);
	}

	@Version("2")
	@Get("/")
	@ApiOkResponse({ type: ProductEntity, isArray: true })
	getProductsByCategoryIdV2(
		@Query() params: IProductParams,
		@Body() filters: { [key: string]: string },
	) {
		return this.productService.getProductsByCategoryIdV2(params, filters);
	}

	@Version("1")
	@Get("/facets")
	@ApiOkResponse({ type: ProductEntity, isArray: true })
	getFacetsByCatIdV1(@Query() params: IProductParams, @Body() filters: { [key: string]: string }) {
		return this.productService.getFacetsByCatIdV1(params, filters);
	}

	@Version("2")
	@Get("/facets")
	@ApiOkResponse({ type: ProductEntity, isArray: true })
	getFacetsByCatIdV2(@Query() params: IProductParams, @Body() filters: { [key: string]: string }) {
		return this.productService.getFacetsByCatIdV2(params, filters);
	}

	@Get(":id")
	@ApiParam({ name: "id", required: true })
	@ApiOkResponse({ type: ProductEntity })
	productByid(@Param("id", ParseIntPipe) id) {
		return this.productService.getProductById(id);
	}
}
