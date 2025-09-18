import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

import { ECurrency, ELanguages, ERoles, IAddress, IUser } from "auth/interfaces/auth.interface";

export class UserDto implements IUser {
	@ApiProperty()
	id: number;

	@ApiProperty()
	firstname: string;

	@ApiProperty()
	lastname: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	password: string;

	@ApiProperty()
	@IsEnum(ERoles)
	role: ERoles;

	@ApiProperty()
	@IsEnum(ELanguages)
	language: ELanguages;

	@ApiProperty()
	@IsEnum(ECurrency)
	currency: ECurrency;

	@ApiProperty({ type: () => [UserAddressDto] })
	addresses?: UserAddressDto[];

	@ApiProperty()
	is_active: boolean;

	@ApiProperty()
	created_at: Date;

	@ApiProperty()
	updated_at: Date;
}

export class UserAddressDto implements IAddress {
	@ApiProperty()
	id: number;

	@ApiProperty()
	user_id: number;

	@ApiProperty()
	country: string;

	@ApiProperty()
	city: string;

	@ApiProperty()
	street: string;

	@ApiProperty()
	house: string;

	@ApiProperty()
	flat: string;

	@ApiProperty()
	zipcode: string;

	@ApiProperty()
	is_default: boolean;

	@ApiProperty()
	created_at: Date;

	@ApiProperty()
	updated_at: Date;
}
