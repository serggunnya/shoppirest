import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as argon from "argon2";
import { Response } from "express";

import { PrismaClientKnownRequestError } from ".prisma/client/runtime/library";
import {
	IJwtTokens,
	IToken,
	IUser,
	IUserCredentials,
	IUserDto,
} from "auth/interfaces/auth.interface";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuthService {
	constructor(
		private jwt: JwtService,
		private prisma: PrismaService,
		private configService: ConfigService,
	) {}

	/**
	 * Метод для создания учётной записи
	 * @param userData даные для регистрации {firstname,lastname,email,password }
	 * @param res Объект ответа для записи токена в cookies
	 * @returns access токен
	 */
	async register(userData: IUserDto, res: Response): Promise<IToken> {
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
			this._setTokenCookie(res, "ACCESS_TOKEN", access_token, 60 * 60 * 1000);
			this._setTokenCookie(res, "REFRESH_TOKEN", refresh_token, 7 * 24 * 60 * 60 * 1000);
			await this._saveRefreshToken(user.id, refresh_token);

			return { access_token };
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
	async login({ email, password }: IUserCredentials, res: Response): Promise<IToken> {
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
		this._setTokenCookie(res, "ACCESS_TOKEN", access_token, 60 * 60 * 1000);
		this._setTokenCookie(res, "REFRESH_TOKEN", refresh_token, 7 * 24 * 60 * 60 * 1000);
		await this._saveRefreshToken(user.id, refresh_token);

		return { access_token };
	}

	/**
	 * Метод получения данных авторизованого пользователя
	 * @param userId id пользователя из access токена
	 * @returns Объект пользователя
	 */
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

	/**
	 * Метод для запроса новой пары токенов
	 * @param userId id пользователя
	 * @param refreshToken refresh токен из cookies
	 * @param res Объект ответа для записи токена в cookies
	 * @returns access токен
	 */
	async refreshTokens(userId: number, tokenId: number, res: Response): Promise<IToken> {
		// Находим токен в базе
		// const tokenRecord = await this.prisma.refresh_tokens.findFirst({
		// 	where: {
		// 		token: refreshToken,
		// 		user_id: userId,
		// 		revoked: false,
		// 		expires_at: { gt: new Date() },
		// 	},
		// });

		// // существует ли токен и не отозван ли он
		// if (!tokenRecord) {
		// 	throw new UnauthorizedException("Invalid or revoked refresh token");
		// }

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

		this._setTokenCookie(res, "ACCESS_TOKEN", access_token, 60 * 60 * 1000);
		this._setTokenCookie(res, "REFRESH_TOKEN", refresh_token, 7 * 24 * 60 * 60 * 1000);
		await this._saveRefreshToken(user.id, refresh_token);

		return { access_token };
	}

	/**
	 * Метод завершения сеанса авторизации
	 * @param userId id пользователя из access токена
	 * @param refreshToken токен обновления из cookies
	 * @param res Объект ответа для очищения cookies
	 * @returns true
	 */
	async logout(userId: number, tokenId: number, res: Response): Promise<{ success: boolean }> {
		// отзываем текущий токен
		await this.prisma.refresh_tokens.updateMany({
			where: { user_id: userId, id: tokenId, revoked: false },
			data: { revoked: true },
		});

		// очищаем cookies
		this._deleteTokenCookie(res, "ACCESS_TOKEN");
		this._deleteTokenCookie(res, "REFRESH_TOKEN");
		return { success: true };
	}

	/**
	 * Метод для завершения авторизации для всех устройств
	 * @param userId id позозователя из access токена
	 * @param res Объект ответа для очищения cookies
	 * @returns true
	 */
	async logoutFromAllDevices(userId: number, res: Response): Promise<{ success: boolean }> {
		// отзыв всех токенов пользователя
		await this.prisma.refresh_tokens.updateMany({
			where: { user_id: userId, revoked: false },
			data: { revoked: true },
		});

		// Очищение cookies
		this._deleteTokenCookie(res, "ACCESS_TOKEN");
		this._deleteTokenCookie(res, "REFRESH_TOKEN");
		return { success: true };
	}

	/**
	 * Приватный метод для генерации пары токенов
	 * @param user Объект пользователя
	 * @returns Пара токенов
	 */
	private async _generateTokens(user: any): Promise<IJwtTokens> {
		const access_token = await this.jwt.signAsync(
			{ sub: user.id, email: user.email, role: user.role },
			{
				expiresIn: "1h",
				secret: this.configService.get("ACCESS_SECRET"),
			},
		);

		const refresh_token = await this.jwt.signAsync(
			{ sub: user.id, email: user.email, role: user.role },
			{
				expiresIn: "7d",
				secret: this.configService.get("REFRESH_SECRET"),
			},
		);

		return { access_token, refresh_token };
	}

	/**
	 * Приватный метод сохранения refresh токена в базе данных
	 * @param userId id пользователя
	 * @param token refresh токен
	 * @returns void
	 */
	private async _saveRefreshToken(userId: number, token: string): Promise<void> {
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 7);

		await this.prisma.refresh_tokens.create({
			data: { token, user_id: userId, expires_at: expiresAt },
		});
	}

	/**
	 * Приватный метод для сохранения токена в cookies
	 * @param res Объект ответа
	 * @param token токен
	 * @returns void
	 */
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
