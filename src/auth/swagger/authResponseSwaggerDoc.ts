import { ApiProperty } from "@nestjs/swagger";

export class AuthResponseSwaggerDoc {
	@ApiProperty({
		example: 200,
	})
	status: number;

	@ApiProperty({
		example: "Operation message",
	})
	message: string;
}
