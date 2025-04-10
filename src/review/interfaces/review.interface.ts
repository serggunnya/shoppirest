export enum EReviewSorting {
	DATE_ASC = "date_asc",
	DATE_DESC = "date_desc",
	RATING = "rating",
}

export interface IReviewParams {
	product: number;
	page?: number;
	sortBy?: EReviewSorting;
}

export interface IReview {
	productId: number;
	userId: number;
	rating?: number;
	text?: string;
}
