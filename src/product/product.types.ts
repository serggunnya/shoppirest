import { Attribute, Product } from "@prisma/client";

export interface IProductParams {
	cat_id: number;
	page?: number;
	limit?: number;
}

export interface IProductImage {
	id: number;
	product_id: Number;
	name: string;
	createdAt: Date;
}

export interface IAttributeEntity extends Attribute {
	id: number;
	name: string;
	alias: string;
	type: number;
	createdAt: Date;
}

export interface ITextOptionEntity {
	id: number;
	alias: string;
	value: string;
	count: number;
}

export interface INumericOptionEntity {
	id: number;
	alias: string;
	min: number;
	max: number;
}

export interface IProductEntity extends Product {
	id: number;
	cat_id: number;
	name: string;
	description: string;
	price: number;
	discount: number;
	available: boolean;
	images: IProductImage[];
	createdAt: Date;
}

export interface IProductsResponse {
	products: IProductEntity[];
	meta: {
		total: number;
		limit: number;
		currentPage: number;
		lastPage: number;
	};
}

export interface IFacetsResponse {
	id: number;
	name: string;
	alias: string;
	type: number;
	options: any[];
	createdAt: Date;
}
