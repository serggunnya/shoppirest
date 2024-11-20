import { Prisma } from ".prisma/client";

export const products: Prisma.ProductCreateInput[] = [
	{
		name: "Xiaomi redmi 7A 2/16Гб",
		price: 7999,
		description: "Мобильный телефон",
		category: { connect: { id: 1 } },
		properties: {
			create: [
				{
					attribute: { connect: { alias: "brand" } },
					option_value: "Xiaomi",
					option_alias: "xiaomi",
				},
				{
					attribute: { connect: { alias: "ram" } },
					option_value: "2Гб",
					option_alias: "2gb",
				},
				{
					attribute: { connect: { alias: "storage" } },
					option_value: "16Гб",
					option_alias: "16gb",
				},
			],
		},
	},
	{
		name: "Xiaomi redmi A2+ 3/64Гб",
		price: 6999,
		description: "Мобильный телефон",
		category: { connect: { id: 1 } },
		properties: {
			create: [
				{
					attribute: { connect: { alias: "brand" } },
					option_value: "Xiaomi",
					option_alias: "xiaomi",
				},
				{
					attribute: { connect: { alias: "ram" } },
					option_value: "3Гб",
					option_alias: "3gb",
				},
				{
					attribute: { connect: { alias: "storage" } },
					option_value: "64Гб",
					option_alias: "64gb",
				},
			],
		},
	},
	{
		name: "Xiaomi redmi 10C 3/64Гб",
		price: 10999,
		description: "Мобильный телефон",
		category: { connect: { id: 1 } },
		properties: {
			create: [
				{
					attribute: { connect: { alias: "brand" } },
					option_value: "Xiaomi",
					option_alias: "xiaomi",
				},
				{
					attribute: { connect: { alias: "ram" } },
					option_value: "3Гб",
					option_alias: "3gb",
				},
				{
					attribute: { connect: { alias: "storage" } },
					option_value: "64Гб",
					option_alias: "64gb",
				},
			],
		},
	},
	{
		name: "Xiaomi redmi 12C 4/128Гб",
		price: 9999,
		description: "Мобильный телефон",
		category: { connect: { id: 1 } },
		properties: {
			create: [
				{
					attribute: { connect: { alias: "brand" } },
					option_value: "Xiaomi",
					option_alias: "xiaomi",
				},
				{
					attribute: { connect: { alias: "ram" } },
					option_value: "4Гб",
					option_alias: "4gb",
				},
				{
					attribute: { connect: { alias: "storage" } },
					option_value: "128Гб",
					option_alias: "128gb",
				},
			],
		},
	},
	{
		name: "Xiaomi redmi note 12S 8/256Гб",
		price: 20999,
		description: "Мобильный телефон",
		category: { connect: { id: 1 } },
		properties: {
			create: [
				{
					attribute: { connect: { alias: "brand" } },
					option_value: "Xiaomi",
					option_alias: "xiaomi",
				},
				{
					attribute: { connect: { alias: "ram" } },
					option_value: "8Гб",
					option_alias: "8gb",
				},
				{
					attribute: { connect: { alias: "storage" } },
					option_value: "256Гб",
					option_alias: "256gb",
				},
			],
		},
	},
	{
		name: "Apple Iphone 12 Pro 4/64Гб",
		price: 82000,
		description: "Мобильный телефон",
		category: { connect: { id: 1 } },
		properties: {
			create: [
				{
					attribute: { connect: { alias: "brand" } },
					option_value: "Apple",
					option_alias: "apple",
				},
				{
					attribute: { connect: { alias: "ram" } },
					option_value: "4Гб",
					option_alias: "4gb",
				},
				{
					attribute: { connect: { alias: "storage" } },
					option_value: "64Гб",
					option_alias: "64gb",
				},
			],
		},
	},
	{
		name: "Apple Iphone 13 4/128Гб",
		price: 77999,
		description: "Мобильный телефон",
		category: { connect: { id: 1 } },
		properties: {
			create: [
				{
					attribute: { connect: { alias: "brand" } },
					option_value: "Apple",
					option_alias: "apple",
				},
				{
					attribute: { connect: { alias: "ram" } },
					option_value: "4Гб",
					option_alias: "4gb",
				},
				{
					attribute: { connect: { alias: "storage" } },
					option_value: "64Гб",
					option_alias: "64gb",
				},
			],
		},
	},
	{
		name: "Apple Iphone 14 Pro 6/256Гб",
		price: 130599,
		description: "Мобильный телефон",
		category: { connect: { id: 1 } },
		properties: {
			create: [
				{
					attribute: { connect: { alias: "brand" } },
					option_value: "Apple",
					option_alias: "apple",
				},
				{
					attribute: { connect: { alias: "ram" } },
					option_value: "6Гб",
					option_alias: "6gb",
				},
				{
					attribute: { connect: { alias: "storage" } },
					option_value: "256Гб",
					option_alias: "256gb",
				},
			],
		},
	},
	{
		name: "Sumsung galaxy A54 6/128Гб",
		price: 45499,
		description: "Мобильный телефон",
		category: { connect: { id: 1 } },
		properties: {
			create: [
				{
					attribute: { connect: { alias: "brand" } },
					option_value: "Sumsung",
					option_alias: "sumsung",
				},
				{
					attribute: { connect: { alias: "ram" } },
					option_value: "6Гб",
					option_alias: "6gb",
				},
				{
					attribute: { connect: { alias: "storage" } },
					option_value: "128Гб",
					option_alias: "128gb",
				},
			],
		},
	},
	{
		name: "Sumsung galaxy S21 8/256Гб",
		price: 45499,
		description: "Мобильный телефон",
		category: { connect: { id: 1 } },
		properties: {
			create: [
				{
					attribute: { connect: { alias: "brand" } },
					option_value: "Sumsung",
					option_alias: "sumsung",
				},
				{
					attribute: { connect: { alias: "ram" } },
					option_value: "8Гб",
					option_alias: "8gb",
				},
				{
					attribute: { connect: { alias: "storage" } },
					option_value: "256Гб",
					option_alias: "256gb",
				},
			],
		},
	},
	{
		name: "Sumsung galaxy S23 ultra 12/256Гб",
		price: 108999,
		description: "Мобильный телефон",
		category: { connect: { id: 1 } },
		properties: {
			create: [
				{
					attribute: { connect: { alias: "brand" } },
					option_value: "Sumsung",
					option_alias: "sumsung",
				},
				{
					attribute: { connect: { alias: "ram" } },
					option_value: "12Гб",
					option_alias: "12gb",
				},
				{
					attribute: { connect: { alias: "storage" } },
					option_value: "256Гб",
					option_alias: "256gb",
				},
			],
		},
	},
	{
		name: "Poco X5 Pro 5G 8/256Гб",
		price: 45499,
		description: "Мобильный телефон",
		category: { connect: { id: 1 } },
		properties: {
			create: [
				{
					attribute: { connect: { alias: "brand" } },
					option_value: "Poco",
					option_alias: "poco",
				},
				{
					attribute: { connect: { alias: "ram" } },
					option_value: "8Гб",
					option_alias: "8gb",
				},
				{
					attribute: { connect: { alias: "storage" } },
					option_value: "256Гб",
					option_alias: "256gb",
				},
			],
		},
	},
	{
		name: "Poco F5 Pro 5G 6/256Гб",
		price: 39499,
		description: "Мобильный телефон",
		category: { connect: { id: 1 } },
		properties: {
			create: [
				{
					attribute: { connect: { alias: "brand" } },
					option_value: "Poco",
					option_alias: "poco",
				},
				{
					attribute: { connect: { alias: "ram" } },
					option_value: "6Гб",
					option_alias: "6gb",
				},
				{
					attribute: { connect: { alias: "storage" } },
					option_value: "256Гб",
					option_alias: "256gb",
				},
			],
		},
	},
	{
		name: "Poco F5 Pro 5G 6/256Гб",
		price: 39499,
		description: "Мобильный телефон",
		category: { connect: { id: 1 } },
		properties: {
			create: [
				{
					attribute: { connect: { alias: "brand" } },
					option_value: "Poco",
					option_alias: "poco",
				},
				{
					attribute: { connect: { alias: "ram" } },
					option_value: "6Гб",
					option_alias: "6gb",
				},
				{
					attribute: { connect: { alias: "storage" } },
					option_value: "256Гб",
					option_alias: "256gb",
				},
			],
		},
	},
	{
		name: "Realme 11 Pro+ 12/512Гб",
		price: 43499,
		description: "Мобильный телефон",
		category: { connect: { id: 1 } },
		properties: {
			create: [
				{
					attribute: { connect: { alias: "brand" } },
					option_value: "Realme",
					option_alias: "realme",
				},
				{
					attribute: { connect: { alias: "ram" } },
					option_value: "12Гб",
					option_alias: "12gb",
				},
				{
					attribute: { connect: { alias: "storage" } },
					option_value: "512Гб",
					option_alias: "512gb",
				},
			],
		},
	},
];
