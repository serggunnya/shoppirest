import { ApiProperty } from "@nestjs/swagger";
import { IUserCredentials } from "auth/interfaces/auth.interface";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto implements IUserCredentials {
	@ApiProperty()
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	password: string;
}
