export interface ICartItemDTO {
	userId: number;
	productId: number;
	productPrice: number;
}

export interface ISelectedItemsDto {
	itemId: number;
	quantity: number;
}

export interface ICartItem {
	id: number;
	productId: number;
	quantity: number;
	sku: string;
	slug: string;
	name: string;
	stock: number;
	price: number;
	discount: number | null;
	images: Record<string, string>;
}
