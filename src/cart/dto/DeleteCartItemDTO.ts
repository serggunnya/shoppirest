import { Transform } from "class-transformer";
import { IsInt } from "class-validator";

export class DeleteCartItemDTO {
	@IsInt()
	@Transform(({ value }) => parseInt(value))
	itemId: number;
}
