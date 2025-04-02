import { createParamDecorator } from "@nestjs/common";
import { Transform } from "class-transformer";
import { IsEnum, IsInt, IsOptional } from "class-validator";

import { ESorting, ISearchParams } from "./interfaces/product.interface";

export const SearchParamsParse = createParamDecorator((data, req) => {
	const result = new SearchParamsDTO();
	result.category = Number(req.query.category);
	result.page = Number(req.query.page);
	result.limit = Number(req.query.limit);
	result.sortBy = req.query.sortBy ? req.query.sortBy : "DEFAULT";

	return result;
});

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

	@IsEnum(ESorting)
	@IsOptional()
	sortBy?: ESorting;

	@IsOptional()
	lang?: string = "ru";
}
