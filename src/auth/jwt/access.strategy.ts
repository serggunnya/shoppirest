import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(Strategy, "jwt") {
	constructor(
		configService: ConfigService,
		private prisma: PrismaService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: Request) => {
					return request?.cookies?.ACCESS_TOKEN;
				},
			]),
			ignoreExpiration: false,
			secretOrKey: configService.get("ACCESS_SECRET"),
		});
	}

	async validate(payload: { sub: number; email: string; role: string }) {
		return { userId: payload.sub, email: payload.email, role: payload.role };
	}
}
