import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

import { AuthController } from "auth/auth.controller";
import { AuthService } from "auth/auth.service";
import { AccessJwtStrategy } from "auth/jwt/access.strategy";
import { RefreshJwtStrategy } from "auth/jwt/refresh.strategy";
import { CartModule } from "cart/cart.module";

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({}),
		}),
		CartModule,
	],
	controllers: [AuthController],
	providers: [AuthService, AccessJwtStrategy, RefreshJwtStrategy],
	exports: [AuthService, JwtModule],
})
export class AuthModule {}
