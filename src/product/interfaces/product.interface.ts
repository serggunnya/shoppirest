import { Prisma, attributes, product_images, products } from "@prisma/client";

export interface RangeValueBodyDto {
	min?: number;
	max?: number;
}

export interface SelectValueBodyDto {
	val: Array<string | number | boolean>;
}

export interface IFiltersBodyDto {
	[key: string]: RangeValueBodyDto | SelectValueBodyDto;
}

export enum ProductSortingEnum {
	DEFAULT = "default",
	PRICE_ASC = "price_asc",
	PRICE_DESC = "price_desc",
	RATING = "rating",
}

export interface IBaseSearchParamsDto {
	category: string;
	lang?: string;
}

export interface IProductSearchParamsDto extends IBaseSearchParamsDto {
	page?: number;
	limit?: number;
	sortBy?: ProductSortingEnum;
}

export interface IProductSearchParams extends Omit<IProductSearchParamsDto, "category"> {
	categoryId: number;
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
	total_count?: number;
	created_at: Date;
	updated_at: Date;
}

export interface IProductWithDetails extends Omit<IProduct, "properties"> {
	details: IProductDetails[];
}

export interface IProductDetails {
	value: string | number | boolean;
	unit_div?: number;
	alias: string;
	type: string;
	name: string;
	description: string;
	display_value: Record<string, string> | null;
	order: number;
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
		min: number;
		max: number;
	};
}

export interface IAttributeWithOption extends IAttribute {
	options: Array<ISelectableOption | IRangeOption>;
}

export interface IAttributeMap {
	[key: string]: IAttributeWithOption;
}
