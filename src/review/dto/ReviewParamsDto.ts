import { Transform } from "class-transformer";
import { IsEnum, IsInt, IsOptional } from "class-validator";

import { EReviewSorting, IReviewParams } from "../interfaces/review.interface";

export class ReviewParamsDTO implements IReviewParams {
	@IsInt()
	@Transform(({ value }) => parseInt(value))
	product: number;

	@IsInt()
	@IsOptional()
	@Transform(({ value }) => parseInt(value))
	page?: number = 1;

	@IsEnum(EReviewSorting)
	@IsOptional()
	sortBy?: EReviewSorting = EReviewSorting.DATE_DESC;
}
