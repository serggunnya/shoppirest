import { ApiProperty } from "@nestjs/swagger";

import { Attribute, Category } from ".prisma/client";

export class CategoryEntity implements Category {
	@ApiProperty()
	id: number;

	@ApiProperty()
	name: string;

	@ApiProperty()
	createdAt: Date;
}

export class AttributeEntity implements Attribute {
	@ApiProperty()
	id: number;

	@ApiProperty()
	name: string;

	@ApiProperty()
	alias: string;

	@ApiProperty()
	createdAt: Date;
}
