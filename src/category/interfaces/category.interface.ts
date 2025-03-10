import { ApiProperty } from "@nestjs/swagger";

export class CategorySwaggerDoc {
	@ApiProperty()
	id: number;

	@ApiProperty()
	name: string;

	@ApiProperty()
	createdAt: Date;
}

export class AttributeSwaggerDoc {
	@ApiProperty()
	id: number;

	@ApiProperty()
	name: string;

	@ApiProperty()
	alias: string;

	@ApiProperty()
	type: number;

	@ApiProperty()
	createdAt: Date;
}
