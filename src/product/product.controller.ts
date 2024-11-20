import { Controller, Get, Param, Query, Version } from "@nestjs/common";
import { ParseIntPipe } from "@nestjs/common/pipes";
import { ApiOkResponse, ApiParam, ApiTags } from "@nestjs/swagger";

import { ProductEntity } from "./ProductEntity";
import { ProductService } from "./product.service";
import { ISearchParams } from "./product.types";

@ApiTags("Products")
@Controller("products")
export class ProductController {
	constructor(private productService: ProductService) {}

	@Version("1")
	@Get("/")
	@ApiOkResponse({ type: ProductEntity, isArray: true })
	getProductsByCatIdV1(@Query() searchParams: ISearchParams) {
		return this.productService.getProductsByCatIdV1(searchParams);
	}

	@Version("2")
	@Get("/")
	@ApiOkResponse({ type: ProductEntity, isArray: true })
	getProductsByCatIdV2(@Query() searchParams: ISearchParams) {
		return this.productService.getProductsByCatIdV2(searchParams);
	}

	@Get(":id")
	@ApiParam({ name: "id", required: true })
	@ApiOkResponse({ type: ProductEntity })
	productByid(@Param("id", ParseIntPipe) id) {
		return this.productService.getProductById(id);
	}
}
