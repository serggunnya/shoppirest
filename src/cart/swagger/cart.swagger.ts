import { ApiProperty } from "@nestjs/swagger";

export class CartSwaggerDoc {
	@ApiProperty()
	id: number;

	@ApiProperty()
	name: string;

	@ApiProperty()
	createdAt: Date;
}
