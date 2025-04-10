import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AccessJwtStrategy } from "./jwt/access.strategy";
import { RefreshJwtStrategy } from "./jwt/refresh.strategy";

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({}),
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, AccessJwtStrategy, RefreshJwtStrategy],
	exports: [AuthService, JwtModule],
})
export class AuthModule {}
