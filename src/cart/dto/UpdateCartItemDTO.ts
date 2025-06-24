import { Transform } from "class-transformer";
import { IsInt } from "class-validator";

export class UpdateCartItemDTO {
	@IsInt()
	@Transform(({ value }) => parseInt(value))
	itemId: number;

	@IsInt()
	@Transform(({ value }) => parseInt(value))
	quantity: number;
}
