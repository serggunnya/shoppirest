import { Body, Controller, Get, Post, Req, Res, UseGuards, Version } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";

import { AuthService } from "auth/auth.service";
import { LoginDto } from "auth/dto/login.dto";
import { AuthResponseSwaggerDoc } from "auth/swagger/authResponseSwaggerDoc";

import { UserDto } from "./dto/user.dto";
import { RequestWithToken, RequestWithUser } from "./interfaces/auth.interface";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post("login")
	@Version("1")
	@ApiOperation({ summary: "Login with credentials" })
	@ApiResponse({ status: 200, description: "Login successful", type: AuthResponseSwaggerDoc })
	@ApiResponse({ status: 403, description: "Credentials incorrect" })
	@ApiResponse({ status: 400, description: "Bad request" })
	@ApiBody({ type: LoginDto })
	login(@Body() credentials: LoginDto, @Res({ passthrough: true }) res: Response) {
		return this.authService.login(credentials, res);
	}

	@Get("me")
	@Version("1")
	@ApiBearerAuth()
	@UseGuards(AuthGuard("jwt"))
	@ApiOperation({ summary: "Get user data" })
	@ApiResponse({ status: 200, description: "User info retrieved successfully", type: UserDto })
	@ApiResponse({ status: 400, description: "Bad request" })
	@ApiResponse({ status: 401, description: "Unauthorized" })
	@ApiResponse({ status: 404, description: "User not found" })
	getUser(@Req() req: RequestWithUser) {
		const userId = req.user.userId;
		return this.authService.getUser(userId);
	}

	@Post("refresh")
	@Version("1")
	@ApiBearerAuth()
	@UseGuards(AuthGuard("jwt-refresh"))
	@ApiOperation({ summary: "Refresh all tokens" })
	@ApiResponse({
		status: 200,
		description: "Token refreshed successfully",
		type: AuthResponseSwaggerDoc,
	})
	@ApiResponse({ status: 401, description: "Unauthorized" })
	@ApiResponse({ status: 400, description: "Bad request" })
	refresh(@Req() req: RequestWithToken, @Res({ passthrough: true }) res: Response) {
		const userId = req.user.userId;
		const tokenId = req.user.tokenId;
		return this.authService.refreshTokens(userId, tokenId, res);
	}

	@Post("logout")
	@Version("1")
	@ApiBearerAuth()
	@UseGuards(AuthGuard("jwt-refresh"))
	@ApiOperation({ summary: "Logout" })
	@ApiResponse({
		status: 200,
		description: "Successfully logged out",
		type: AuthResponseSwaggerDoc,
	})
	@ApiResponse({ status: 401, description: "Unauthorized" })
	@ApiResponse({ status: 400, description: "Bad request" })
	logout(@Req() req: RequestWithToken, @Res({ passthrough: true }) res: Response) {
		const userId = req.user.userId;
		const tokenId = req.user.tokenId;
		return this.authService.logout(userId, tokenId, res);
	}

	@Post("logout-all")
	@Version("1")
	@UseGuards(AuthGuard("jwt"))
	@ApiBearerAuth()
	@ApiOperation({ summary: "Logout from all devices" })
	@ApiResponse({
		status: 200,
		description: "Successfully logged out from all devices",
		type: AuthResponseSwaggerDoc,
	})
	@ApiResponse({ status: 401, description: "Unauthorized" })
	@ApiResponse({ status: 400, description: "Bad request" })
	logoutAll(@Req() req: RequestWithUser, @Res({ passthrough: true }) res: Response) {
		const userId = req.user.userId;
		return this.authService.logoutFromAllDevices(userId, res);
	}
}
