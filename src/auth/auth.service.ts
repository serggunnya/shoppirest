import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as argon from "argon2";

import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { PrismaClientKnownRequestError } from ".prisma/client/runtime/library";

@Injectable()
export class AuthService {
	constructor(
		private config: ConfigService,
		private prisma: PrismaService,
		private jwt: JwtService,
	) {}

	async register(userData: RegisterDto) {
		const hash = await argon.hash(userData.password);

		try {
			const user = await this.prisma.users.create({
				data: {
					email: userData.email,
					password: hash,
					username: userData.username,
					role: "USER",
				},
			});

			const access_token = await this.jwt.signAsync(
				{ sub: user.id, email: user.email, role: user.role },
				{ expiresIn: "1h", secret: this.config.get("ACCESS_SECRET") },
			);

			const refresh_token = await this.jwt.signAsync(
				{ sub: user.id, email: user.email },
				{ expiresIn: "7d", secret: this.config.get("REFRESH_SECRET") },
			);

			return { access_token, refresh_token };
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === "P2002") {
					throw new ForbiddenException("Credentials taken");
				}
			}
			throw error;
		}
	}

	async login({ email, password }: LoginDto) {
		const user = await this.prisma.users.findUnique({ where: { email } });

		if (!user) {
			throw new ForbiddenException("Credentials incorrect");
		}

		const checkPassword = await argon.verify(user.password, password);

		if (!checkPassword) {
			throw new ForbiddenException("Credentials incorrect");
		}

		const access_token = await this.jwt.signAsync(
			{ sub: user.id, email: user.email, role: user.role },
			{ expiresIn: "1h", secret: this.config.get("ACCESS_SECRET") },
		);

		const refresh_token = await this.jwt.signAsync(
			{ sub: user.id, email: user.email },
			{ expiresIn: "7d", secret: this.config.get("REFRESH_SECRET") },
		);

		return { access_token, refresh_token };
	}

	//async getUser() {}
}
