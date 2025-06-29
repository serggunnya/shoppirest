import { Transform } from "class-transformer";
import { IsEnum, IsInt, IsOptional } from "class-validator";

import { IProductSearchParamsDto, ProductSortingEnum } from "../interfaces/product.interface";

export class ProductSearchParamsDto implements IProductSearchParamsDto {
	@IsInt()
	@Transform(({ value }) => parseInt(value))
	category: number;

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
