import { Prisma, attributes, product_images, products } from "@prisma/client";

export interface RangeValue {
	min?: number;
	max?: number;
}

export interface SelectValue {
	val: (string | number | boolean)[];
}

export interface ISearchFilters {
	[key: string]: RangeValue | SelectValue;
}

export enum EProductSorting {
	DEFAULT = "default",
	PRICE_ASC = "price_asc",
	PRICE_DESC = "price_desc",
	RATING = "rating",
}

export interface ISearchParams {
	category: number;
	page?: number;
	limit?: number;
	sortBy?: EProductSorting;
	lang?: string;
}

export interface IProductImage extends product_images {
	id: number;
	product_id: number;
	url: string;
	order: number;
	created_at: Date;
	updated_at: Date;
}

export interface IProduct extends products {
	id: number;
	slug: string;
	sku: string;
	category_id: number;
	price: Prisma.Decimal;
	discount: Prisma.Decimal;
	old_price: Prisma.Decimal;
	stock: number;
	name?: string;
	description?: string;
	meta_title?: string;
	meta_description?: string;
	properties: IProductProp[];
	images: IProductImage[];
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
}

export interface IProductProp {
	[key: string]: {
		value: string | number | boolean;
		unit_div?: number;
	};
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
	STRING = "STRING",
	TEXT = "TEXT",
	NUMBER = "NUMBER",
	NUMERIC = "NUMERIC",
	BOOLEAN = "BOOLEAN",
}

export interface IAttribute extends attributes {
	id: number;
	alias: string;
	type: AttributeType;
	name?: string;
	description?: string;
	display_value?: JSON;
	is_filterable: boolean;
	order: number;
	created_at: Date;
	updated_at: Date;
}

export interface ISelectableOption {
	alias: string;
	data: {
		value: string;
		unit_div?: number;
	};
	amount: number;
}

export interface IRangeOption {
	alias: string;
	data: {
		value: {
			min: number;
			max: number;
		};
	};
}

export interface IAttributeWithOption extends IAttribute {
	options: Array<ISelectableOption | IRangeOption>;
}

export interface IAttributeMap {
	[key: string]: IAttributeWithOption;
}
