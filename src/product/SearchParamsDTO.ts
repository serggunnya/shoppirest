import { Transform } from "class-transformer";
import { IsEnum, IsInt, IsOptional } from "class-validator";

import { EProductSorting, ISearchParams } from "./interfaces/product.interface";

export class SearchParamsDTO implements ISearchParams {
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

	@IsEnum(EProductSorting)
	@IsOptional()
	sortBy?: EProductSorting = EProductSorting.DEFAULT;

	@IsOptional()
	lang?: string = "ru";
}
