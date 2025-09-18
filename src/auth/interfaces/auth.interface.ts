import { addresses, users } from "@prisma/client";
import { Request } from "express";

export interface ILoginDto {
	email: string;
	password: string;
}

export interface IRegisterDto extends ILoginDto {
	firstname: string;
	lastname: string;
}

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

export interface AuthTokens {
	access_token: string;
	refresh_token: string;
}

export interface AuthResponse {
	status: number;
	message: string;
}

export enum ERoles {
	ADMIN = "ADMIN",
	CUSTOMER = "CUSTOMER",
}

export enum ELanguages {
	ru = "ru",
	en = "en",
}

export enum ECurrency {
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
