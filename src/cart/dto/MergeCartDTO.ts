import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { CartItemDTO } from "./CartItemDTO";

export class MergeCartDTO {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CartItemDTO)
	guestCartItems: CartItemDTO[];
}
