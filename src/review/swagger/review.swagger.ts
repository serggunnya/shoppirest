import { ApiProperty } from "@nestjs/swagger";

export class ReviewSwaggerDoc {
	@ApiProperty()
	id: number;

	@ApiProperty()
	name: string;

	@ApiProperty()
	createdAt: Date;
}
