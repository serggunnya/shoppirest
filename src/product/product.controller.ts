import { Body, Controller, Get, Param, Post, Query, Version } from "@nestjs/common";
import { ParseIntPipe } from "@nestjs/common/pipes";
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

import { BaseSearchParamsDto } from "./dto/BaseSearchParamsDto";
import { ProductSearchParamsDto } from "./dto/ProductSearchParamsDto";
import { IFiltersBodyDto } from "./interfaces/product.interface";
import { ProductService } from "./product.service";
import { FacetSwaggerDoc } from "./swagger/Facet.swagger";
import { ProductResponseSwaggerDoc, ProductSwaggerDoc } from "./swagger/Product.swagger";

const example = `
	{ 
    "brand": { "val": ["Apple","Samsung","Xiaomi"]}, 
    "ram": { "val": [4096, 8192]}, 
    "storage": { "val": [65536, 262144]}, 
    "price": { "min": 45000},
    "screen_size": { "max": 6.4},
    "net5g": { "val": [true]}
	}
	`;

@ApiTags("Products")
@Controller("products")
export class ProductController {
	constructor(private productService: ProductService) {}

	//---------------------------------------------------------------------------
	@Post("/search")
	@Version("1")
	@ApiQuery({ name: "category", required: true, default: "smartphones" })
	@ApiQuery({ name: "page", required: true, default: 1 })
	@ApiQuery({ name: "limit", required: false, default: 5 })
	@ApiQuery({ name: "sortBy", required: false, default: "default" })
	@ApiQuery({ name: "lang", required: false, default: "ru" })
	@ApiBody({
		required: false,
		schema: { type: `object` },
		description: `Product filters example 
			${example}
		`,
	})
	@ApiResponse({ status: 200, type: ProductResponseSwaggerDoc })
	@ApiOperation({ summary: "Get list of products", operationId: "1" })
	searchProducts(
		@Query() searchParams: ProductSearchParamsDto,
		@Body() filtersBody: IFiltersBodyDto,
	) {
		return this.productService.searchProducts(searchParams, filtersBody);
	}

	//---------------------------------------------------------------------------
	@Post("/facets")
	@Version("1")
	@ApiQuery({ name: "category", required: true, default: "smartphones" })
	@ApiQuery({ name: "lang", required: false, default: "ru" })
	@ApiBody({
		required: false,
		description: `Product facets example 
			${example}
		`,
		schema: { type: `object` },
	})
	@ApiResponse({ status: 200, type: FacetSwaggerDoc, isArray: true })
	@ApiOperation({ summary: "Get list of all or filtered attributes with available options" })
	getFacetsByCategoryIdV1(
		@Query() searchParams: BaseSearchParamsDto,
		@Body() filtersBody: IFiltersBodyDto,
	) {
		return this.productService.getFacets(searchParams, filtersBody);
	}

	//---------------------------------------------------------------------------
	@Get(":id")
	@Version("1")
	@ApiParam({ name: "id", required: true })
	@ApiQuery({ name: "lang", required: false, default: "ru" })
	@ApiResponse({ status: 200, type: ProductSwaggerDoc })
	@ApiOperation({ summary: "Get product by Id" })
	getProductById(@Param("id", ParseIntPipe) id: number, @Query("lang") locale: string = "ru") {
		return this.productService.getProductDetails(id, locale);
	}
}
