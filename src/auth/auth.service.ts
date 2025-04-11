import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as argon from "argon2";
import { IJwtTokens, IToken, IUserCredentials, IUserDto } from "auth/interfaces/auth.interface";
import { Response } from "express";

import { PrismaClientKnownRequestError } from ".prisma/client/runtime/library";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
		private configService: ConfigService,
	) {}

	/**
	 * Метод для создания учётной записи
	 * @param userData даные для регистрации {firstname,lastname,email,password }
	 * @param res Объект ответа для записи токена в cookies
	 * @returns access токен
	 */
	async register(userData: IUserDto, res: Response): Promise<IToken> {
		const hash = await argon.hash(userData.password);

		try {
			// создаём нового пользователя
			const user = await this.prisma.users.create({
				data: { email: userData.email, password: hash, role: "CUSTOMER" },
			});

			// генерируем новые токены
			const { access_token, refresh_token } = await this._generateTokens(user);
			await this._saveRefreshToken(user.id, refresh_token);
			this._setRefreshTokenCookie(res, refresh_token);

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
		await this._saveRefreshToken(user.id, refresh_token);
		this._setRefreshTokenCookie(res, refresh_token);

		return { access_token };
	}

	/**
	 * Метод для запроса новой пары токенов
	 * @param userId id пользователя
	 * @param refreshToken refresh токен из cookies
	 * @param res Объект ответа для записи токена в cookies
	 * @returns access токен
	 */
	async refreshTokens(userId: number, refreshToken: string, res: Response): Promise<IToken> {
		// Находим токен в базе
		const tokenRecord = await this.prisma.refresh_tokens.findFirst({
			where: {
				token: refreshToken,
				user_id: userId,
				revoked: false,
				expires_at: { gt: new Date() },
			},
		});

		// существует ли токен и не отозван ли он
		if (!tokenRecord) {
			throw new UnauthorizedException("Invalid or revoked refresh token");
		}

		// находим пользователя
		const user = await this.prisma.users.findUnique({ where: { id: userId } });

		if (!user) {
			throw new ForbiddenException("Access Denied");
		}

		// Отзываем старый токен
		await this.prisma.refresh_tokens.update({
			where: { id: tokenRecord.id },
			data: { revoked: true },
		});

		// генерируем новые токены
		const { access_token, refresh_token } = await this._generateTokens(user);
		await this._saveRefreshToken(user.id, refresh_token);
		this._setRefreshTokenCookie(res, refresh_token);

		return { access_token };
	}

	/**
	 * Метод завершения сеанса авторизации
	 * @param userId id пользователя из access токена
	 * @param refreshToken токен обновления из cookies
	 * @param res Объект ответа для очищения cookies
	 * @returns true
	 */
	async logout(userId: number, refreshToken: string, res: Response): Promise<{ success: boolean }> {
		// отзываем текущий токен
		await this.prisma.refresh_tokens.updateMany({
			where: { user_id: userId, token: refreshToken, revoked: false },
			data: { revoked: true },
		});

		// очищаем cookies
		res.clearCookie("refresh_token");
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
		res.clearCookie("refresh_token");
		return { success: true };
	}

	/**
	 * Метод получения данных авторизованого пользователя
	 * @param userId id пользователя из access токена
	 * @returns Объект пользователя
	 */
	async getUser(userId: number) {
		const user = await this.prisma.users.findUnique({
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
				cart: true,
				orders: true,
			},
		});

		if (!user) {
			throw new ForbiddenException("User not found");
		}

		return user;
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
	 * Приватный метод для сохранения refresh токена в cookies
	 * @param res Объект ответа
	 * @param token токен
	 * @returns void
	 */
	private _setRefreshTokenCookie(res: Response, token: string) {
		res?.cookie("refresh_token", token, {
			httpOnly: false,
			secure: false, //process.env.NODE_ENV !== "development", // true в production
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
			path: "/api/auth",
		});
	}
}
