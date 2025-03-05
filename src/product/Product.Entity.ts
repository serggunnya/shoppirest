import { ApiProperty } from "@nestjs/swagger";
import { Product } from "@prisma/client";

import { JsonValue } from ".prisma/client/runtime/library";

export class ProductImageDoc {
	@ApiProperty()
	id: number;

	@ApiProperty()
	product_id: Number;

	@ApiProperty()
	name: string;

	@ApiProperty()
	createdAt: Date;
}

export class ProductEntityDoc implements Product {
	@ApiProperty()
	id: number;

	@ApiProperty()
	cat_id: number;

	@ApiProperty()
	name: string;

	@ApiProperty()
	description: string;

	@ApiProperty()
	price: number;

	@ApiProperty()
	discount: number;

	@ApiProperty()
	available: boolean;

	@ApiProperty()
	properties: JsonValue;

	@ApiProperty({ isArray: true })
	images: ProductImageDoc;

	@ApiProperty()
	createdAt: Date;
}

export class ProductMetaDoc {
	@ApiProperty()
	total: number;

	@ApiProperty()
	limit: number;

	@ApiProperty()
	currentPage: number;

	@ApiProperty()
	lastPage: number;
}

export class ProductResponseDoc {
	@ApiProperty({ isArray: true })
	products: ProductEntityDoc;

	@ApiProperty()
	meta: ProductMetaDoc;
}

export class ProductPriceResponseDoc {
	@ApiProperty()
	min: Number;

	@ApiProperty()
	max: Number;
}

// export class OptionEntityDoc implements Product_property {
// 	@ApiProperty()
// 	id: number;

// 	@ApiProperty()
// 	prod_id: number;

// 	@ApiProperty()
// 	attr_alias: string;

// 	@ApiProperty()
// 	option_value: string;

// 	@ApiProperty()
// 	option_alias: string;

// 	@ApiProperty()
// 	count: number;

// 	@ApiProperty()
// 	createdAt: Date;
// }

// export class FacetsResponseDoc implements Attribute {
// 	@ApiProperty()
// 	id: number;

// 	@ApiProperty()
// 	name: string;

// 	@ApiProperty()
// 	alias: string;

// 	@ApiProperty({ isArray: true })
// 	options: OptionEntityDoc;

// 	@ApiProperty()
// 	createdAt: Date;
// }
