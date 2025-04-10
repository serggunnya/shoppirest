import { Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { IReview, IReviewParams } from "./interfaces/review.interface";

@Injectable()
export class ReviewService {
	constructor(private prisma: PrismaService) {}

	/**
	 * Метод создания отзыва
	 * @param productId
	 * @param userId
	 * @param text
	 * @param rating
	 * @returns Отзыв
	 */
	async createReview(createReviewDto: IReview) {
		const { productId, userId, text, rating } = createReviewDto;
		const review = await this.prisma.reviews.create({
			data: {
				product_id: productId,
				user_id: userId,
				text: text,
				rating: rating,
			},
		});

		return review;
	}

	/**
	 * Метод получения отзывов по id продукта
	 * @param params {page, product, sortBy}
	 * @returns Отзывы по id продукта
	 */
	async getReviewsByProductId(params: IReviewParams) {
		console.log(params);
		const limit = 10;
		const offset = params.page > 0 ? limit * (params.page - 1) : 0;

		return await this.prisma.$queryRaw`			
			SELECT * FROM reviews r
			WHERE product_id = ${params.product}
			ORDER BY 
				CASE WHEN ${params.sortBy} = 'date_asc' THEN created_at END ASC,
				CASE WHEN ${params.sortBy} = 'date_desc' THEN created_at END DESC,
				CASE WHEN ${params.sortBy} = 'rating_desc' THEN rating END DESC,		
				CASE WHEN ${params.sortBy} = 'rating_asc' THEN rating END ASC		
			LIMIT ${limit} OFFSET ${offset}
		`;
	}
}
