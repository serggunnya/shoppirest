import { Prisma, attributes, product_images, products } from "@prisma/client";

export enum ProductSortingEnum {
	DEFAULT = "default",
	PRICE_ASC = "price_asc",
	PRICE_DESC = "price_desc",
	RATING = "rating",
}

export interface ProductsRequestParams {
	category: string;
	page?: number;
	lang?: string;
	limit?: number;
	sortBy?: ProductSortingEnum;
}

export interface FacetRequestParams {
	category: string;
	lang?: string;
}

export interface SelectValueRequest {
	val: Array<string | number | boolean>;
}

export interface RangeValueRequest {
	min?: number;
	max?: number;
}

export type FiltersRequestData = Record<string, SelectValueRequest | RangeValueRequest>;

export interface AttributeStringOption {
	alias: string;
	data: {
		value: string;
	};
	amount: number;
}

export interface AttributeNumberOption {
	alias: string;
	data: {
		value: string;
		unit_div?: number;
	};
	amount: number;
}

export interface AttributeBooleanOption {
	alias: string;
	data: {
		value: boolean;
	};
	amount: number;
}

export interface AttributeRangeOption {
	alias: string;
	data: {
		min: number;
		max: number;
	};
}

export interface AttributeOptionsMap {
	TEXT: AttributeStringOption;
	STRING: AttributeStringOption;
	NUMBER: AttributeNumberOption;
	BOOLEAN: AttributeBooleanOption;
	NUMERIC: AttributeRangeOption;
}

export type AttributeType = keyof AttributeOptionsMap;

export type AttributeOptionsArray = Array<AttributeOptionsMap[AttributeType]>;

export interface Attribute extends attributes {
	id: number;
	alias: string;
	type: AttributeType;
	name: string;
	description: string;
	display_value: JSON | null;
	is_filterable: boolean;
	order: number;
	created_at: Date;
	updated_at: Date;
}

export interface BaseFacet<T extends AttributeType> extends Attribute {
	type: T;
	options: Array<AttributeOptionsMap[T]>;
}

export type TypedFacet = {
	[K in AttributeType]: BaseFacet<K>;
}[AttributeType];

export type FacetsMap = Record<string, TypedFacet>;

export interface ProductImage extends product_images {
	id: number;
	product_id: number;
	url: string;
	order: number;
	created_at: Date;
	updated_at: Date;
}

export interface Product extends products {
	id: number;
	category_id: number;
	slug: string;
	sku: string;
	name: string;
	description: string;
	meta_title?: string;
	meta_description?: string;
	price: Prisma.Decimal;
	discount: Prisma.Decimal;
	old_price: Prisma.Decimal;
	stock: number;
	images: ProductImage[];
	avg_rating: number;
	review_count: number;
	total_count?: number;
}

export interface ProductsResponse {
	products: Product[];
	meta: {
		total: number;
		limit: number;
		currentPage: number;
		lastPage: number;
	};
}

export interface DetailValueMap {
	TEXT: string;
	STRING: string;
	NUMBER: number;
	NUMERIC: number;
	BOOLEAN: boolean;
}

export type DetailType = keyof DetailValueMap;

export interface BaseDetail<T extends DetailType> {
	alias: string;
	type: T;
	name: string;
	value: DetailValueMap[T];
	unit_div?: number;
	display_value: Record<string, string> | null;
	order: number;
}

export type TypedDetail = {
	[K in DetailType]: BaseDetail<K>;
}[DetailType];

export interface ProductDetail extends Omit<Product, "properties"> {
	details: TypedDetail[];
}
