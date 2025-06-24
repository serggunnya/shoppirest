import { Transform } from "class-transformer";
import { IsInt, IsOptional, IsString } from "class-validator";

export class CheckoutDTO {
	@IsInt()
	@Transform(({ value }) => parseInt(value))
	cartId: number;

	@IsString()
	@IsOptional()
	shippingAddress?: string;

	@IsString()
	@IsOptional()
	paymentMethod?: string;
}
