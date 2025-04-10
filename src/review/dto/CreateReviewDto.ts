import { Transform } from "class-transformer";
import { IsInt, IsOptional, IsString } from "class-validator";
import { IReview } from "review/interfaces/review.interface";

export class CreateReviewDto implements IReview {
	@IsInt()
	@Transform(({ value }) => parseInt(value))
	productId: number;

	@IsInt()
	@Transform(({ value }) => parseInt(value))
	userId: number;

	@IsInt()
	@Transform(({ value }) => parseInt(value))
	rating?: number;

	@IsString()
	@IsOptional()
	text?: string;
}
