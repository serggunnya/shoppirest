import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
	constructor(configService: ConfigService, private prisma: PrismaService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: Request) => {
					return request?.cookies?.refresh_token;
				},
			]),
			secretOrKey: configService.get("REFRESH_SECRET"),
			ignoreExpiration: false,
			passReqToCallback: true,
		});
	}

	async validate(req: Request, payload: { sub: number; email: string; role: string }) {
		// получаем исходный токен
		const refreshToken = req.cookies?.refresh_token;

		if (!refreshToken) {
			throw new UnauthorizedException("Refresh token not found");
		}

		// Проверяем, существует ли токен в базе и не отозван ли он
		const tokenRecord = await this.prisma.refresh_tokens.findFirst({
			where: {
				token: refreshToken,
				user_id: payload.sub,
				revoked: false,
				expires_at: { gt: new Date() },
			},
		});

		if (!tokenRecord) {
			throw new UnauthorizedException("Invalid or revoked refresh token");
		}

		return {
			userId: payload.sub,
			email: payload.email,
			role: payload.role,
			refreshToken,
		};
	}
}
