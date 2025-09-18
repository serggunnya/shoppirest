import { PrismaClientKnownRequestError } from ".prisma/client/runtime/library";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as argon from "argon2";
import { Response } from "express";

import {
	AuthResponse,
	AuthTokens,
	ILoginDto,
	IRegisterDto,
	IUser,
} from "auth/interfaces/auth.interface";

import { PrismaService } from "../prisma/prisma.service";

const access_token_TTL = 60 * 60 * 1000;
const refresh_token_TTL = 7 * 24 * 60 * 60 * 1000;

@Injectable()
export class AuthService {
	constructor(
		private jwt: JwtService,
		private prisma: PrismaService,
		private configService: ConfigService,
	) {}

	// Метод для создания учётной записи
	async register(userData: IRegisterDto, res: Response): Promise<AuthResponse> {
		// проверяем наличие пользователя с таким email
		const userExists = await this.prisma.users.findUnique({
			where: { email: userData.email },
		});

		if (userExists) {
			throw new ForbiddenException("Credentials taken");
		}

		try {
			// хэшируем пароль
			const hashedPassword = await argon.hash(userData.password);

			// создаём нового пользователя
			const user = await this.prisma.users.create({
				data: {
					firstname: userData.firstname,
					lastname: userData.lastname,
					email: userData.email,
					password: hashedPassword,
					role: "CUSTOMER",
				},
			});

			// создаём корзину пользователя
			await this.prisma.carts.create({ data: { user_id: user.id } });

			// генерируем новые токены
			const { access_token, refresh_token } = await this._generateTokens(user);
			this._setTokenCookie(res, "ACCESS_TOKEN", access_token, access_token_TTL);
			this._setTokenCookie(res, "REFRESH_TOKEN", refresh_token, refresh_token_TTL);
			await this._saveRefreshToken(user.id, refresh_token);

			return { message: "Login successful", status: 200 };
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === "P2002") {
					throw new ForbiddenException("Credentials taken");
				}
			}
			throw error;
		}
	}

	/**
	 * Метод для входа в учётную запись
	 * @param credentials даные для авторизации { email, password }
	 * @param res Объект ответа для записи токена в cookies
	 * @returns access токен
	 */
	async login({ email, password }: ILoginDto, res: Response): Promise<AuthResponse> {
		// находим пользователя
		const user = await this.prisma.users.findUnique({ where: { email } });

		if (!user) {
			throw new ForbiddenException("Credentials incorrect");
		}

		// проверяем совпадение пароля
		const checkPassword = await argon.verify(user.password, password);

		if (!checkPassword) {
			throw new ForbiddenException("Credentials incorrect");
		}

		// генерируем новые токены
		const { access_token, refresh_token } = await this._generateTokens(user);
		this._setTokenCookie(res, "ACCESS_TOKEN", access_token, access_token_TTL);
		this._setTokenCookie(res, "REFRESH_TOKEN", refresh_token, refresh_token_TTL);
		await this._saveRefreshToken(user.id, refresh_token);

		return { message: "Login successful", status: 200 };
	}

	// Метод получения данных авторизованого пользователя
	async getUser(userId: number) {
		const user = (await this.prisma.users.findUnique({
			where: { id: userId },
			select: {
				id: true,
				firstname: true,
				lastname: true,
				email: true,
				role: true,
				language: true,
				currency: true,
				addresses: true,
			},
		})) as IUser;

		if (!user) {
			throw new ForbiddenException("User not found");
		}

		return { user };
	}

	// Метод для запроса новой пары токенов
	async refreshTokens(userId: number, tokenId: number, res: Response): Promise<AuthResponse> {
		// находим пользователя
		const user = await this.prisma.users.findUnique({ where: { id: userId } });

		if (!user) {
			throw new ForbiddenException("Access Denied");
		}

		// Отзываем старый токен
		await this.prisma.refresh_tokens.update({
			where: { id: tokenId },
			data: { revoked: true },
		});

		// генерируем новые токены
		const { access_token, refresh_token } = await this._generateTokens(user);

		this._setTokenCookie(res, "ACCESS_TOKEN", access_token, access_token_TTL);
		this._setTokenCookie(res, "REFRESH_TOKEN", refresh_token, refresh_token_TTL);
		await this._saveRefreshToken(user.id, refresh_token);

		return { message: "Tokens refreshed", status: 200 };
	}

	// Метод завершения сеанса авторизации
	async logout(userId: number, tokenId: number, res: Response): Promise<AuthResponse> {
		// отзываем текущий токен
		await this.prisma.refresh_tokens.updateMany({
			where: { user_id: userId, id: tokenId, revoked: false },
			data: { revoked: true },
		});

		// очищаем cookies
		this._deleteTokenCookie(res, "ACCESS_TOKEN");
		this._deleteTokenCookie(res, "REFRESH_TOKEN");
		return { message: "Logout successful", status: 200 };
	}

	// Метод для завершения авторизации для всех устройств
	async logoutFromAllDevices(userId: number, res: Response): Promise<AuthResponse> {
		// отзыв всех токенов пользователя
		await this.prisma.refresh_tokens.updateMany({
			where: { user_id: userId, revoked: false },
			data: { revoked: true },
		});

		// Очищение cookies
		this._deleteTokenCookie(res, "ACCESS_TOKEN");
		this._deleteTokenCookie(res, "REFRESH_TOKEN");
		return { message: "Logout successful", status: 200 };
	}

	// Приватный метод для генерации пары токенов
	private async _generateTokens(userData: {
		id: number;
		email: string;
		role: string;
	}): Promise<AuthTokens> {
		const access_token = await this.jwt.signAsync(
			{ sub: userData.id, email: userData.email, role: userData.role },
			{
				expiresIn: "1h",
				secret: this.configService.get("ACCESS_SECRET"),
			},
		);

		const refresh_token = await this.jwt.signAsync(
			{ sub: userData.id, email: userData.email, role: userData.role },
			{
				expiresIn: "7d",
				secret: this.configService.get("REFRESH_SECRET"),
			},
		);

		return { access_token, refresh_token };
	}

	// Приватный метод сохранения refresh токена в базе данных
	private async _saveRefreshToken(userId: number, token: string): Promise<void> {
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 7);

		await this.prisma.refresh_tokens.create({
			data: { token, user_id: userId, expires_at: expiresAt },
		});
	}

	// Приватный метод для сохранения токена в cookies
	private _setTokenCookie(res: Response, name: string, token: string, age: number) {
		res?.cookie(name, token, {
			httpOnly: true,
			secure: process.env.NODE_ENV !== "development", // true в production
			sameSite: "none",
			maxAge: age,
			path: "/api/",
		});
	}

	private _deleteTokenCookie(res: Response, name: string) {
		res?.clearCookie(name, {
			httpOnly: true,
			sameSite: "none",
			path: "/api/",
		});
	}
}
