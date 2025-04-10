import { ApiProperty } from "@nestjs/swagger";

export class FacetSwaggerDoc {
	@ApiProperty()
	id: number;

	@ApiProperty()
	alias: string;

	@ApiProperty()
	type: "TEXT" | "NUMBER" | "NUMERIC" | "BOOLEAN";

	@ApiProperty()
	name?: string;

	@ApiProperty({ nullable: true })
	description?: string | null;

	@ApiProperty({ nullable: true })
	display_value?: JSON | null;

	@ApiProperty()
	order: number;

	@ApiProperty({ isArray: true })
	options: { [key: string]: any }[];

	@ApiProperty()
	createdAt: Date;
}
