import { ApiProperty } from "@nestjs/swagger";

export class AuthResponseSwaggerDoc {
	@ApiProperty({
		example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
		description: "JWT access token",
	})
	access_token: string;
}
