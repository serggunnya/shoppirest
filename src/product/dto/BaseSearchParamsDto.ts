import { IsOptional, IsString } from "class-validator";

import { IBaseSearchParamsDto } from "product/interfaces/product.interface";

export class BaseSearchParamsDto implements IBaseSearchParamsDto {
	@IsString()
	category: string;

	@IsOptional()
	lang?: string = "ru";
}
