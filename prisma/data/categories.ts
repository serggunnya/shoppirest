import { Prisma } from "@prisma/client";

export const categories: Prisma.categoriesCreateInput[] = [
	{
		// id: 1,
		slug: "smartphones",
		image: "/images/categories/smartphones.jpg",
		is_active: true,
		translations: {
			create: [
				{
					locale: "ru",
					name: "Смартфоны",
					description: "Мобильные телефоны и смартфоны различных брендов",
				},
				{
					locale: "en",
					name: "Smartphones",
					description: "Mobile phones and smartphones from various brands",
				},
			],
		},
	},
	{
		// id: 2,
		slug: "tvs",
		image: "/images/categories/tvs.jpg",
		is_active: true,
		translations: {
			create: [
				{
					locale: "ru",
					name: "Телевизоры",
					description: "Современные телевизоры Smart TV",
				},
				{
					locale: "en",
					name: "TVs",
					description: "Modern Smart TVs",
				},
			],
		},
	},
	{
		// id: 3,
		slug: "laptops",
		image: "/images/categories/laptops.jpg",
		is_active: true,
		translations: {
			create: [
				{
					locale: "ru",
					name: "Ноутбуки",
					description: "Ноутбуки для работы и развлечений",
				},
				{
					locale: "en",
					name: "Laptops",
					description: "Laptops for work and entertainment",
				},
			],
		},
	},
];
