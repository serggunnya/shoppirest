import { Transform } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";

import { ProductSortingEnum, ProductsRequestParams } from "../interfaces/product.interface";

export class ProductParamsDto implements ProductsRequestParams {
	@IsString()
	category: string;

	@IsInt()
	@IsOptional()
	@Transform(({ value }) => parseInt(value))
	page?: number = 1;

	@IsInt()
	@IsOptional()
	@Transform(({ value }) => parseInt(value))
	limit?: number = 5;

	@IsEnum(ProductSortingEnum)
	@IsOptional()
	sortBy?: ProductSortingEnum = ProductSortingEnum.DEFAULT;

	@IsOptional()
	lang?: string = "ru";
}
