import { Transform } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

import { IBaseSearchParamsDto } from "product/interfaces/product.interface";

export class BaseSearchParamsDto implements IBaseSearchParamsDto {
	@IsInt()
	@Transform(({ value }) => parseInt(value))
	category: number;

	@IsOptional()
	lang?: string = "ru";
}
