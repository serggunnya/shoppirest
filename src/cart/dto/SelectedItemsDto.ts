import { IsInt } from "class-validator";

import { ISelectedItemsDto } from "cart/interfaces/cart.interface";

export class SelectedItemsDto implements ISelectedItemsDto {
	@IsInt()
	itemId: number;

	@IsInt()
	quantity: number;
}
