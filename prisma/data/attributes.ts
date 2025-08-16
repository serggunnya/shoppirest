import { AttributeType, Prisma } from "@prisma/client";

export const attributes: Prisma.attributesCreateInput[] = [
	{
		// id: 1,
		alias: "price",
		type: AttributeType.NUMERIC,
		is_filterable: true,
		translations: {
			create: [
				{
					locale: "ru",
					name: "Цена",
					description: "Цена товара",
				},
				{
					locale: "en",
					name: "Price",
					description: "Product price",
				},
			],
		},
	},
	{
		// id: 2,
		alias: "brand",
		type: AttributeType.STRING,
		is_filterable: true,
		translations: {
			create: [
				{
					locale: "ru",
					name: "Бренд",
					description: "Производитель устройства",
				},
				{
					locale: "en",
					name: "Brand",
					description: "Device manufacturer",
				},
			],
		},
	},
	{
		// id: 3,
		alias: "color",
		type: AttributeType.TEXT,
		is_filterable: true,
		translations: {
			create: [
				{
					locale: "ru",
					name: "Цвет",
					description: "Цвет товара",
				},
				{
					locale: "en",
					name: "Color",
					description: "Product color",
				},
			],
		},
	},
	{
		// id: 4,
		alias: "screen_size",
		type: AttributeType.NUMERIC,
		is_filterable: true,
		translations: {
			create: [
				{
					locale: "ru",
					name: "Размер экрана",
					description: "Размер экрана устройства",
				},
				{
					locale: "en",
					name: "Screen size",
					description: "Screen size of the device",
				},
			],
		},
	},
	{
		// id: 5,
		alias: "screen_res",
		type: AttributeType.STRING,
		is_filterable: false,
		translations: {
			create: [
				{
					locale: "ru",
					name: "Разрешение экрана",
					description: "Разрешение экрана устройства",
				},
				{
					locale: "en",
					name: "Screen resolution",
					description: "Screen resolution of the device",
				},
			],
		},
	},
	{
		// id: 6,
		alias: "ram",
		type: AttributeType.NUMBER,
		is_filterable: true,
		translations: {
			create: [
				{
					locale: "ru",
					name: "Оперативная память",
					description: "Оперативная память устройства",
				},
				{
					locale: "en",
					name: "RAM",
					description: "RAM of the device",
				},
			],
		},
	},
	{
		// id: 7,
		alias: "storage",
		type: AttributeType.NUMBER,
		is_filterable: true,
		translations: {
			create: [
				{
					locale: "ru",
					name: "Хранилище",
					description: "Хранилище устройства",
				},
				{
					locale: "en",
					name: "Storage",
					description: "Storage of the device",
				},
			],
		},
	},
	{
		// id: 8,
		alias: "smart_tv",
		type: AttributeType.BOOLEAN,
		is_filterable: true,
		translations: {
			create: [
				{
					locale: "ru",
					name: "Смарт-телевизор",
					description: "Смарт-телевизор",
				},
				{
					locale: "en",
					name: "Smart TV",
					description: "Smart TV",
				},
			],
		},
	},
	{
		// id: 9,
		alias: "cpu_model",
		type: AttributeType.STRING,
		is_filterable: true,
		translations: {
			create: [
				{
					locale: "ru",
					name: "Модель процессора",
					description: "Модель процессора устройства",
				},
				{
					locale: "en",
					name: "CPU model",
					description: "CPU model of the device",
				},
			],
		},
	},
	{
		// id: 10,
		alias: "gpu_model",
		type: AttributeType.STRING,
		is_filterable: true,
		translations: {
			create: [
				{
					locale: "ru",
					name: "Модель графического процессора",
					description: "Модель графического процессора",
				},
				{
					locale: "en",
					name: "GPU model",
					description: "GPU model",
				},
			],
		},
	},
	{
		// id: 11,
		alias: "сpu_brand",
		type: AttributeType.STRING,
		is_filterable: true,
		translations: {
			create: [
				{
					locale: "ru",
					name: "Бренд процессора",
					description: "Бренд процессора",
				},
				{
					locale: "en",
					name: "CPU brand",
					description: "CPU brand",
				},
			],
		},
	},
	{
		// id: 12,
		alias: "gpu_brand",
		type: AttributeType.STRING,
		is_filterable: true,
		translations: {
			create: [
				{
					locale: "ru",
					name: "Бренд графического процессора",
					description: "Бренд графического процессора",
				},
				{
					locale: "en",
					name: "GPU brand",
					description: "GPU brand",
				},
			],
		},
	},
	{
		// id: 13,
		alias: "os",
		type: AttributeType.STRING,
		is_filterable: true,
		translations: {
			create: [
				{
					locale: "ru",
					name: "Операционная система",
					description: "Операционная система устройства",
				},
				{
					locale: "en",
					name: "OS",
					description: "Operating system of the device",
				},
			],
		},
	},
	{
		// id: 14,
		alias: "os_ver",
		type: AttributeType.STRING,
		is_filterable: true,
		translations: {
			create: [
				{
					locale: "ru",
					name: "Версия операционной системы",
					description: "Версия операционной системы устройства",
				},
				{
					locale: "en",
					name: "OS version",
					description: "OS version of the device",
				},
			],
		},
	},
	{
		// id: 15,
		alias: "screen_type",
		type: AttributeType.STRING,
		is_filterable: true,
		translations: {
			create: [
				{
					locale: "ru",
					name: "Тип экрана",
					description: "Тип экрана устройства",
				},
				{
					locale: "en",
					name: "Screen type",
					description: "Screen type of the device",
				},
			],
		},
	},
	{
		// id: 16,
		alias: "rearcam_amt",
		type: AttributeType.STRING,
		is_filterable: false,
		translations: {
			create: [
				{
					locale: "ru",
					name: "Количество камер на задней панели",
					description: "Количество камер на задней панели устройства",
				},
				{
					locale: "en",
					name: "Rear camera amount",
					description: "Rear camera amount of the device",
				},
			],
		},
	},
	{
		// id: 17,
		alias: "maincam_res",
		type: AttributeType.NUMBER,
		is_filterable: true,
		translations: {
			create: [
				{
					locale: "ru",
					name: "Разрешение основной камеры",
					description: "Разрешение основной камеры устройства",
				},
				{
					locale: "en",
					name: "Rear camera resolution",
					description: "Rear camera resolution of the device",
				},
			],
		},
	},
	{
		// id: 18,
		alias: "frontcam_res",
		type: AttributeType.NUMBER,
		is_filterable: true,
		translations: {
			create: [
				{
					locale: "ru",
					name: "Разрешение фронтальной камеры",
					description: "Разрешение фронтальной камеры устройства",
				},
				{
					locale: "en",
					name: "Front camera resolution",
					description: "Front camera resolution of the device",
				},
			],
		},
	},
	{
		// id: 19,
		alias: "net4g",
		type: AttributeType.BOOLEAN,
		is_filterable: true,
		translations: {
			create: [
				{
					locale: "ru",
					name: "Поддержка 4G",
					description: "Поддержка 4G устройства",
				},
				{
					locale: "en",
					name: "4G support",
					description: "4G support of the device",
				},
			],
		},
	},
	{
		// id: 20,
		alias: "net5g",
		type: AttributeType.BOOLEAN,
		is_filterable: true,
		translations: {
			create: [
				{
					locale: "ru",
					name: "Поддержка 5G",
					description: "Поддержка 5G устройства",
				},
				{
					locale: "en",
					name: "5G support",
					description: "5G support of the device",
				},
			],
		},
	},
	{
		// id: 21,
		alias: "fm_mod",
		type: AttributeType.BOOLEAN,
		is_filterable: true,
		translations: {
			create: [
				{
					locale: "ru",
					name: "Модуль FM",
					description: "Модуль FM устройства",
				},
				{
					locale: "en",
					name: "FM module",
					description: "FM module of the device",
				},
			],
		},
	},
	{
		// id: 22,
		alias: "extra_mem",
		type: AttributeType.BOOLEAN,
		is_filterable: true,
		translations: {
			create: [
				{
					locale: "ru",
					name: "Поддержка карт памяти",
					description: "Поддержка карт памяти",
				},
				{
					locale: "en",
					name: "Memory card support",
					description: "Memory card support",
				},
			],
		},
	},
	{
		// id: 23,
		alias: "btr_cap",
		type: AttributeType.NUMERIC,
		is_filterable: true,
		translations: {
			create: [
				{
					locale: "ru",
					name: "Емкость батареи",
					description: "Емкость батареи устройства",
				},
				{
					locale: "en",
					name: "Battery capacity",
					description: "Battery capacity of the device",
				},
			],
		},
	},
	{
		// id: 24,
		alias: "chrg_pwr",
		type: AttributeType.NUMERIC,
		is_filterable: true,
		translations: {
			create: [
				{
					locale: "ru",
					name: "Мощность зарядного устройства",
					description: "Мощность зарядного устройства",
				},
				{
					locale: "en",
					name: "Charging power",
					description: "Charging power of the device",
				},
			],
		},
	},
];

export const categoryAttributes = [
	// Смартфоны
	{ category_id: 2, attribute_id: 1 }, // price
	{ category_id: 2, attribute_id: 2 }, // brand
	{ category_id: 2, attribute_id: 3 }, // color
	{ category_id: 2, attribute_id: 4 }, // screen_size
	{ category_id: 2, attribute_id: 5 }, // screen_res
	{ category_id: 2, attribute_id: 6 }, // ram
	{ category_id: 2, attribute_id: 7 }, // storage
	{ category_id: 2, attribute_id: 9 }, // cpu_model
	{ category_id: 2, attribute_id: 10 }, // gpu_model
	{ category_id: 2, attribute_id: 11 }, // cpu_brand
	{ category_id: 2, attribute_id: 12 }, // gpu_brand
	{ category_id: 2, attribute_id: 13 }, // os
	{ category_id: 2, attribute_id: 14 }, // os_ver
	{ category_id: 2, attribute_id: 15 }, // screen_type
	{ category_id: 2, attribute_id: 16 }, // rearcam_amt
	{ category_id: 2, attribute_id: 17 }, // maincam_res
	{ category_id: 2, attribute_id: 18 }, // frontcam_res
	{ category_id: 2, attribute_id: 19 }, // net4g
	{ category_id: 2, attribute_id: 20 }, // net5g
	{ category_id: 2, attribute_id: 21 }, // fm_mod
	{ category_id: 2, attribute_id: 22 }, // extra_mem
	{ category_id: 2, attribute_id: 23 }, // btr_cap
	{ category_id: 2, attribute_id: 24 }, // chrg_pwr
	// Телевизоры
	{ category_id: 5, attribute_id: 1 }, // price
	{ category_id: 5, attribute_id: 2 }, // brand
	{ category_id: 5, attribute_id: 3 }, // color
	{ category_id: 5, attribute_id: 4 }, // screen_size
	{ category_id: 5, attribute_id: 5 }, // resolution
	{ category_id: 5, attribute_id: 8 }, // smart_tv
	{ category_id: 5, attribute_id: 6 }, // ram
	{ category_id: 5, attribute_id: 7 }, // storage
	// Ноутбуки
	{ category_id: 7, attribute_id: 1 }, // price
	{ category_id: 7, attribute_id: 2 }, // brand
	{ category_id: 7, attribute_id: 3 }, // color
	{ category_id: 7, attribute_id: 4 }, // screen_size
	{ category_id: 7, attribute_id: 5 }, // resolution
	{ category_id: 7, attribute_id: 6 }, // ram
	{ category_id: 7, attribute_id: 7 }, // storage
	{ category_id: 7, attribute_id: 9 }, // processor
	{ category_id: 7, attribute_id: 10 }, // graphics
];

export const units: Prisma.unitsCreateInput[] = [
	{
		// id: 1,
		locale: "ru",
		display_value: { 1: "МБ", 1024: "ГБ", 1048576: "ТБ" },
	},
	{
		// id: 2,
		locale: "en",
		display_value: { 1: "MB", 1024: "GB", 1048576: "TB" },
	},
	{
		// id: 3,
		locale: "ru",
		display_value: {
			black: "Черный",
			white: "Белый",
			red: "Красный",
			blue: "Голубой",
			green: "Зеленый",
			yellow: "Желтый",
			purple: "Фиолетовый",
			pink: "Розовый",
			gray: "Серый",
			gold: "Золотой",
			silver: "Серебряный",
		},
	},
	{
		// id: 4,
		locale: "en",
		display_value: {
			black: "Black",
			white: "White",
			red: "Red",
			blue: "Blue",
			green: "Green",
			yellow: "Yellow",
			purple: "Purple",
			pink: "Pink",
			gray: "Gray",
			gold: "Gold",
			silver: "Silver",
		},
	},
];

export const attributeUnits = [
	{ attribute_id: 6, unit_id: 1 }, // ram
	{ attribute_id: 6, unit_id: 2 }, // ram
	{ attribute_id: 7, unit_id: 1 }, // storage
	{ attribute_id: 7, unit_id: 2 }, // storage
	{ attribute_id: 3, unit_id: 3 }, // color
	{ attribute_id: 3, unit_id: 4 }, // color
];
