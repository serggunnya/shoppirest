import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
	constructor(config: ConfigService, private prisma: PrismaService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.get("ACCESS_SECRET"),
		});
	}

	async validate(payload: { sub: number; email: string }) {
		const user = await this.prisma.users.findUnique({
			where: { id: payload.sub },
		});
		delete user.password;
		return user;
	}
}
