import { Body, Controller, Get, Post, Req, Res, UseGuards, Version } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";

import { AuthService } from "auth/auth.service";
import { LoginDto } from "auth/dto/login.dto";
import { RegisterDto } from "auth/dto/register.dto";
import { AuthResponseSwaggerDoc } from "auth/swagger/authResponseSwaggerDoc";
import { RequestWithToken, RequestWithUser } from "./interfaces/auth.interface";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post("register")
	@Version("1")
	@ApiOperation({ summary: "Register a new user", operationId: "1" })
	@ApiResponse({
		status: 201,
		description: "User registered successfully",
		type: AuthResponseSwaggerDoc,
	})
	@ApiResponse({ status: 403, description: "Credentials taken" })
	@ApiBody({ type: RegisterDto })
	register(@Body() userData: RegisterDto, @Res({ passthrough: true }) res: Response) {
		return this.authService.register(userData, res);
	}

	@Post("login")
	@Version("1")
	@ApiOperation({ summary: "Login with credentials", operationId: "2" })
	@ApiResponse({ status: 200, description: "Login successful", type: AuthResponseSwaggerDoc })
	@ApiResponse({ status: 403, description: "Credentials incorrect" })
	@ApiBody({ type: LoginDto })
	login(@Body() credentials: LoginDto, @Res({ passthrough: true }) res: Response) {
		return this.authService.login(credentials, res);
	}

	@Post("refresh")
	@Version("1")
	@ApiBearerAuth()
	@UseGuards(AuthGuard("jwt-refresh"))
	@ApiOperation({ summary: "Refresh all tokens", operationId: "6" })
	@ApiResponse({
		status: 200,
		description: "Token refreshed successfully",
		type: AuthResponseSwaggerDoc,
	})
	@ApiResponse({ status: 401, description: "Unauthorized" })
	refresh(@Req() req: RequestWithToken, @Res({ passthrough: true }) res: Response) {
		const userId = req.user.userId;
		const refreshToken = req.user.refreshToken;
		return this.authService.refreshTokens(userId, refreshToken, res);
	}

	@Post("logout")
	@Version("1")
	@ApiBearerAuth()
	@UseGuards(AuthGuard("jwt-refresh"))
	@ApiOperation({ summary: "Logout", operationId: "4" })
	@ApiResponse({ status: 200, description: "Successfully logged out" })
	@ApiResponse({ status: 401, description: "Unauthorized" })
	logout(@Req() req: RequestWithToken, @Res({ passthrough: true }) res: Response) {
		const userId = req.user.userId;
		const refreshToken = req.user.refreshToken;
		return this.authService.logout(userId, refreshToken, res);
	}

	@Post("logout-all")
	@Version("1")
	@UseGuards(AuthGuard("jwt"))
	@ApiBearerAuth()
	@ApiOperation({ summary: "Logout from all devices", operationId: "5" })
	@ApiResponse({ status: 200, description: "Successfully logged out from all devices" })
	@ApiResponse({ status: 401, description: "Unauthorized" })
	logoutAll(@Req() req: RequestWithUser, @Res({ passthrough: true }) res: Response) {
		const userId = req.user.userId;
		return this.authService.logoutFromAllDevices(userId, res);
	}

	@Get("me")
	@Version("1")
	@ApiBearerAuth()
	@UseGuards(AuthGuard("jwt"))
	@ApiOperation({ summary: "Get current user info", operationId: "3" })
	@ApiResponse({ status: 200, description: "User info retrieved successfully" })
	@ApiResponse({ status: 401, description: "Unauthorized" })
	@ApiOperation({ summary: "Get user data" })
	getUser(@Req() req: RequestWithUser) {
		const userId = req.user.userId;
		return this.authService.getUser(userId);
	}
}
