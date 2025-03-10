import { ApiProperty } from "@nestjs/swagger";

export class AttributeSwaggerDoc {
	@ApiProperty()
	id: number;

	@ApiProperty()
	name: string;

	@ApiProperty()
	alias: string;

	@ApiProperty({ isArray: true })
	options: { [key: string]: any }[];

	@ApiProperty()
	createdAt: Date;
}

export class FacetSwaggerDoc {
	@ApiProperty()
	alias: AttributeSwaggerDoc;
}
