import { ICartItemDTO } from "cart/interfaces/cart.interface";
import { Transform } from "class-transformer";
import { IsInt, IsNumber } from "class-validator";

export class CartItemDTO implements ICartItemDTO {
	@IsInt()
	@Transform(({ value }) => parseInt(value))
	userId: number;

	@IsInt()
	@Transform(({ value }) => parseInt(value))
	productPrice: number;

	@IsNumber()
	@Transform(({ value }) => parseInt(value))
	productId: number;
}
