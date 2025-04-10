import { Body, Controller, Get, Post, Query, UseGuards, Version } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
	ApiBearerAuth,
	ApiBody,
	ApiOperation,
	ApiQuery,
	ApiResponse,
	ApiTags,
} from "@nestjs/swagger";

import { CreateReviewDto } from "./dto/CreateReviewDto";
import { ReviewParamsDTO } from "./dto/ReviewParamsDto";
import { ReviewService } from "./review.service";
import { ReviewSwaggerDoc } from "./swagger/review.swagger";

@ApiTags("Reviews")
@Controller("reviews")
export class ReviewController {
	constructor(private reviewService: ReviewService) {}

	@Post("/")
	@Version("1")
	@ApiBody({ type: CreateReviewDto })
	@ApiResponse({ status: 200, type: ReviewSwaggerDoc, isArray: true })
	@ApiOperation({ summary: "Create new reviews", operationId: "1" })
	@UseGuards(AuthGuard("jwt"))
	createReview(@Body() reviewDto: CreateReviewDto) {
		return this.reviewService.createReview(reviewDto);
	}

	@Get("/")
	@Version("1")
	@ApiBearerAuth()
	@UseGuards(AuthGuard("jwt"))
	@ApiQuery({ name: "product", required: true })
	@ApiQuery({ name: "page", required: false })
	@ApiQuery({ name: "sortBy", required: false })
	@ApiResponse({ status: 200, type: ReviewSwaggerDoc, isArray: true })
	@ApiOperation({ summary: "Get list of reviews", operationId: "1" })
	allReviewsByProductId(@Query() params: ReviewParamsDTO) {
		return this.reviewService.getReviewsByProductId(params);
	}
}
