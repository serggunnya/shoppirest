import { Body, Controller, Get, Param, Post, Query, Version } from "@nestjs/common";
import { ParseIntPipe } from "@nestjs/common/pipes";
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

import { SearchParamsDTO } from "./SearchParamsDTO";
import { ISearchFilters } from "./interfaces/product.interface";
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
	@ApiQuery({ name: "category", required: true })
	@ApiQuery({ name: "page", required: true })
	@ApiQuery({ name: "limit", required: false })
	@ApiQuery({ name: "sortBy", required: false })
	@ApiQuery({ name: "lang", required: false })
	@ApiBody({
		required: false,
		schema: { type: `object` },
		description: `Product filters example 
			${example}
		`,
	})
	@ApiResponse({ status: 200, type: ProductResponseSwaggerDoc })
	@ApiOperation({ summary: "Get list of products", operationId: "1" })
	searchProducts(@Query() params: SearchParamsDTO, @Body() filters: ISearchFilters) {
		return this.productService.searchProducts(params, filters);
	}

	//---------------------------------------------------------------------------
	@Post("/facets")
	@Version("1")
	@ApiQuery({ name: "category", required: true })
	@ApiQuery({ name: "lang", required: false })
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
		@Query("category", ParseIntPipe) category: number,
		@Query("lang") locale: string = "ru",
		@Body() filters: ISearchFilters,
	) {
		return this.productService.getFacets(category, filters, locale);
	}

	//---------------------------------------------------------------------------
	@Get(":id")
	@Version("1")
	@ApiParam({ name: "id", required: true })
	@ApiQuery({ name: "lang", required: false })
	@ApiResponse({ status: 200, type: ProductSwaggerDoc })
	@ApiOperation({ summary: "Get product by Id" })
	getProductById(@Param("id", ParseIntPipe) id, @Query("lang") locale: string = "ru") {
		return this.productService.getProductDetails(id, locale);
	}
}
