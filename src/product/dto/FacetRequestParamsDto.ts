import { IsOptional, IsString } from "class-validator";

import { FacetRequestParams } from "product/interfaces/product.interface";

export class FacetRequestParamsDto implements FacetRequestParams {
	@IsString()
	category: string;

	@IsOptional()
	lang?: string = "ru";
}
