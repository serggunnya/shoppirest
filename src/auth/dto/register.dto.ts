import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

import { IRegisterDto } from "auth/interfaces/auth.interface";

export class RegisterDto implements IRegisterDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	firstname: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	lastname: string;

	@ApiProperty()
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	password: string;
}
