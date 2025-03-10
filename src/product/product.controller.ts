import { Body, Controller, Get, Param, Post, Query, Version } from "@nestjs/common";
import { ParseIntPipe } from "@nestjs/common/pipes";
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";

import { IFilters, IProductQueryParams } from "./interfaces/product.interface";
import { ProductService } from "./product.service";
import { FacetSwaggerDoc } from "./swagger/Facet.swagger";
import { ProductResponseSwaggerDoc, ProductSwaggerDoc } from "./swagger/Product.swagger";

const example = `
	{ 
		"ram": { "val": ["8", "12"]}, 
		"storage": { "val": ["128", "256"]}, 
		"price": { "min": 15000, "max": 80000},
		...
		}
	`;

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
		description: `Product filters example 
			${example}
		`,
		schema: { type: `object` },
	})
	@ApiOkResponse({ status: 200, type: ProductResponseSwaggerDoc })
	@ApiOperation({ summary: "Get list of all or filtered products", operationId: "1" })
	getProductsByCategoryIdV1(
		@Query() params: IProductQueryParams,
		@Body() filters: IFilters,
	) {
		return this.productService.getProductsByCategoryIdV1(params, filters);
	}

	//---------------------------------------------------------------------------
	@Post("/facets")
	@Version("1")
	@ApiQuery({ name: "cat_id", required: true })
	@ApiBody({
		required: false,
		description: `Product facets example 
			${example}
		`,
		schema: { type: `object` },
	})
	@ApiOkResponse({ status: 200, type: FacetSwaggerDoc })
	@ApiOperation({ summary: "Get list of all or filtered attributes with available options" })
	getFacetsByCategoryIdV1(
		@Query() params: IProductQueryParams,
		@Body() filters: IFilters,
	) {
		return this.productService.getFacetsByCategoryIdV1(params, filters);
	}

	//---------------------------------------------------------------------------
	@Get(":id")
	@Version("1")
	@ApiParam({ name: "id", required: true })
	@ApiOkResponse({ status: 200, type: ProductSwaggerDoc })
	@ApiOperation({ summary: "Get product by Id" })
	getProductById(@Param("id", ParseIntPipe) id) {
		return this.productService.getProductById(id);
	}
}
