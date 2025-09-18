import { Body, Controller, Get, Param, Post, Query, Version } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

import { FacetRequestParamsDto } from "./dto/FacetRequestParamsDto";
import { ProductParamsDto } from "./dto/ProductParamsDto";
import { FiltersRequestData } from "./interfaces/product.interface";
import { ProductService } from "./product.service";
import { FacetSwaggerDoc } from "./swagger/Facet.swagger";
import { ProductResponseSwaggerDoc, ProductSwaggerDoc } from "./swagger/Product.swagger";

const exampleBody = {
	brand: { val: ["Apple", "Samsung", "Xiaomi"] },
	ram: { val: [4096, 8192] },
	storage: { val: [65536, 262144] },
	price: { min: 45000 },
	screen_size: { max: 6.4 },
	net5g: { val: [true] },
};

@ApiTags("Products")
@Controller("products")
export class ProductController {
	constructor(private productService: ProductService) {}

	//---------------------------------------------------------------------------
	@Post("/facets")
	@Version("1")
	@ApiQuery({ name: "category", required: true, default: "smartphones" })
	@ApiQuery({ name: "lang", required: false, default: "ru" })
	@ApiBody({
		required: false,
		schema: { type: `object`, example: exampleBody },
	})
	@ApiResponse({ status: 200, type: FacetSwaggerDoc, isArray: true })
	@ApiResponse({ status: 400, description: "Bad request" })
	@ApiOperation({ summary: "Get list of all or filtered attributes with available options" })
	getFacetsByCategoryIdV1(
		@Query() facetRequestParams: FacetRequestParamsDto,
		@Body() filtersRequestData: FiltersRequestData,
	) {
		return this.productService.getFacets(facetRequestParams, filtersRequestData);
	}

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
		schema: { type: `object`, example: exampleBody },
	})
	@ApiResponse({ status: 200, type: ProductResponseSwaggerDoc })
	@ApiResponse({ status: 400, description: "Bad request" })
	@ApiOperation({ summary: "Get list of products" })
	searchProducts(
		@Query() searchParams: ProductParamsDto,
		@Body() filtersRequestData: FiltersRequestData,
	) {
		return this.productService.searchProducts(searchParams, filtersRequestData);
	}

	//---------------------------------------------------------------------------
	@Get(":slug")
	@Version("1")
	@ApiParam({ name: "slug", required: true })
	@ApiQuery({ name: "lang", required: false, default: "ru" })
	@ApiResponse({ status: 200, type: ProductSwaggerDoc })
	@ApiResponse({ status: 404, description: "Product not found" })
	@ApiResponse({ status: 400, description: "Bad request" })
	@ApiOperation({ summary: "Get product by slug" })
	getProductById(@Param("slug") slug: string, @Query("lang") locale: string = "ru") {
		return this.productService.getProductDetails(slug, locale);
	}
}
