import { Prisma } from "@prisma/client";

export const categories: Prisma.categoriesCreateInput[] = [
	{
		// id: 1,
		slug: "gadgets",
		image: "/images/categories/gadgets.jpg",
		is_active: true,
		translations: {
			create: [
				{
					locale: "ru",
					name: "Гаджеты",
					description: "Смартфоны, планшеты, умные-часы и другие гаджеты",
				},
				{
					locale: "en",
					name: "Gadgets",
					description: "Smartphones, tablets, smartwatches and other gadgets",
				},
			],
		},
	},
	{
		// id: 2,
		slug: "smartphones",
		parent: { connect: { id: 1 } },
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
		// id: 3,
		slug: "tablets",
		parent: { connect: { id: 1 } },
		image: "/images/categories/tablets.jpg",
		is_active: true,
		translations: {
			create: [
				{
					locale: "ru",
					name: "Планшеты",
					description: "Планшеты различных брендов",
				},
				{
					locale: "en",
					name: "Tablets",
					description: "Tablets from various brands",
				},
			],
		},
	},
	{
		// id: 4,
		slug: "home-appliances",
		image: "/images/categories/home-appliances.jpg",
		is_active: true,
		translations: {
			create: [
				{
					locale: "ru",
					name: "Бытовая техника",
					description: "Телевизоры, холодильники, микроволновки и другие бытовые приборы",
				},
				{
					locale: "en",
					name: "Home Appliances",
					description: "Televisions, refrigerators, microwaves and other home appliances",
				},
			],
		},
	},
	{
		// id: 5,
		slug: "tvs",
		parent: { connect: { id: 4 } },
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
		// id: 6,
		slug: "computers-and-laptops",
		image: "/images/categories/computers-and-laptops.jpg",
		is_active: true,
		translations: {
			create: [
				{
					locale: "ru",
					name: "Компьютеры и ноутбуки",
					description: "Компьютеры и ноутбуки для работы и развлечений",
				},
				{
					locale: "en",
					name: "Computers and Laptops",
					description: "Computers and laptops for work and entertainment",
				},
			],
		},
	},
	{
		// id: 7,
		slug: "laptops",
		parent: { connect: { id: 6 } },
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
