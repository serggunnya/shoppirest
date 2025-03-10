import { Attribute, Product } from "@prisma/client";

export interface NumericValue {
	min?: number;
	max?: number;
}

export interface MultiValue {
	val: (string | boolean)[];
}

export interface IFilters {
	[key: string]: NumericValue | MultiValue;
}

export interface IProductQueryParams {
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

export interface IProduct extends Product {
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

export interface IProductsWithMeta {
	products: IProduct[];
	meta: {
		total: number;
		limit: number;
		currentPage: number;
		lastPage: number;
	};
}

export enum AttributeType {
	BOOLEAN = 0,
	TEXT = 1,
	INTEGER = 2,
	FLOAT = 3,
}

export interface IAttribute extends Attribute {
	id: number;
	name: string;
	alias: string;
	type: AttributeType;
	createdAt: Date;
}

export interface ITextOption {
	id: number;
	alias: string;
	value: string;
	count: number;
}

export interface INumericOption {
	id: number;
	alias: string;
	min: number;
	max: number;
}

export interface IAttributeWithOptions extends IAttribute {
	options: Array<ITextOption | INumericOption>;
}

export interface IAttributeMap {
	[key: string]: IAttributeWithOptions;
}

export type IFacets = IAttributeMap;
