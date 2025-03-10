import { ApiProperty } from "@nestjs/swagger";

import { JsonValue } from ".prisma/client/runtime/library";

export class ProductImageSwaggerDoc {
	@ApiProperty()
	id: number;

	@ApiProperty()
	product_id: Number;

	@ApiProperty()
	name: string;

	@ApiProperty()
	createdAt: Date;
}

export class ProductSwaggerDoc {
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
	images: ProductImageSwaggerDoc;

	@ApiProperty()
	createdAt: Date;
}

export class ProductMetaSwaggerDoc {
	@ApiProperty()
	total: number;

	@ApiProperty()
	limit: number;

	@ApiProperty()
	currentPage: number;

	@ApiProperty()
	lastPage: number;
}

export class ProductResponseSwaggerDoc {
	@ApiProperty({ isArray: true })
	products: ProductSwaggerDoc;

	@ApiProperty()
	meta: ProductMetaSwaggerDoc;
}
