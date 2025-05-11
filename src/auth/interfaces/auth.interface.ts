import { addresses, users } from "@prisma/client";
import { Request } from "express";

interface JwtAccessPayload {
	userId: number;
	email: string;
	role: string;
}

interface JwtRefreshPayload extends JwtAccessPayload {
	tokenId: number;
}

export type RequestWithUser = Request & { user: JwtAccessPayload };
export type RequestWithToken = Request & { user: JwtRefreshPayload };

export interface IToken {
	access_token: string;
}

export interface IJwtTokens extends IToken {
	refresh_token: string;
}

export interface IUserCredentials {
	email: string;
	password: string;
}

export interface IUserDto extends IUserCredentials {
	firstname: string;
	lastname: string;
}

enum ERoles {
	ADMIN = "ADMIN",
	CUSTOMER = "CUSTOMER",
}

enum ELanguages {
	ru = "ru",
	en = "en",
}

enum ECurrency {
	RUB = "RUB",
	USD = "USD",
}

export interface IAddress extends addresses {
	id: number;
	country: string;
	city: string;
	street: string;
	house: string;
	flat: string;
	zipcode: string;
	is_default: boolean;
}

export interface IUser extends users {
	id: number;
	firstname: string | null;
	lastname: string | null;
	email: string;
	role: ERoles;
	language: ELanguages;
	currency: ECurrency;
	addresses?: IAddress[];
	created_at: Date;
	updated_at: Date;
}
