import { ApiProperty } from "@nestjs/swagger";
import { IUserDto } from "auth/interfaces/auth.interface";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RegisterDto implements IUserDto {
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
