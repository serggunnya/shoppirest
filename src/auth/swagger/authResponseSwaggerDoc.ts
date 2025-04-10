import { ApiProperty } from "@nestjs/swagger";
import { IToken } from "auth/interfaces/auth.interface";

export class AuthResponseSwaggerDoc implements IToken {
	@ApiProperty({ description: "JWT access token" })
	access_token: string;
}
