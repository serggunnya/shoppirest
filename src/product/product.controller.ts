import { Body, Controller, Get, Param, Post, Query, Version } from "@nestjs/common";
import { ParseIntPipe } from "@nestjs/common/pipes";
import { ApiBody, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";

import { ProductEntityDoc, ProductResponseDoc } from "./Product.Entity";
import { ProductService } from "./product.service";
import { IProductParams } from "./product.types";

const example = `{
			"minPrice": 0,
			"maxPrice": 130599,
			"ram": ["2gb", "3gb", "4gb", "8gb"],
			"storage": ["16gb", "128gb"],
			...
		}`;

@ApiTags("Products")
@Controller("products")
export class ProductController {
	constructor(private productService: ProductService) {}

	//---------------------------------------------------------------------------
	@Post("/")
	@Version("1")
	@ApiQuery({ name: "cat_id", required: true })
	@ApiQuery({ name: "page", required: true })
	@ApiQuery({ name: "limit", required: false })
	@ApiBody({
		required: false,
		description: `Product filters example ${example}`,
		schema: { type: `object` },
	})
	@ApiOkResponse({ type: ProductResponseDoc })
	@ApiOperation({ description: "Get list of all or filtered products", operationId: "1" })
	getProductsByCategoryIdV1(
		@Query() params: IProductParams,
		@Body() filters: { [key: string]: any },
	) {
		return this.productService.getProductsByCategoryIdV1(params, filters);
	}

	//---------------------------------------------------------------------------
	@Post("/facets")
	@Version("1")
	@ApiQuery({ name: "cat_id", required: true })
	@ApiBody({
		required: false,
		description: `Product facets example ${example}`,
		schema: { type: `object` },
	})
	// @ApiOkResponse({ type: FacetsResponseDoc, isArray: true })
	@ApiOperation({ description: "Get list of all or filtered attributes with available options" })
	getFacetsByCategoryIdV1(
		@Query() params: IProductParams,
		@Body() filters: { [key: string]: any },
	) {
		return this.productService.getFacetsByCategoryIdV1(params, filters);
	}

	//---------------------------------------------------------------------------
	@Get(":id")
	@Version("1")
	@ApiQuery({ name: "id", required: true })
	@ApiOkResponse({ type: ProductEntityDoc })
	@ApiOperation({ description: "Get product by Id" })
	getProductById(@Param("id", ParseIntPipe) id) {
		return this.productService.getProductById(id);
	}
}
