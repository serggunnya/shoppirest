import { Prisma } from ".prisma/client";

export const categories: Prisma.CategoryCreateInput[] = [
	{ name: "Телефоны" },
	{ name: "Телевизоры" },
	{ name: "Ноутбуки" },
];

export const attributes: Prisma.AttributeCreateInput[] = [
	{ name: "Производитель", alias: "brand", type: 1 },
	{ name: "Операционная система", alias: "os", type: 1 },
	{ name: "Версия системы", alias: "os_ver", type: 1 },
	{ name: "Оболочка системы", alias: "os_ui", type: 1 },
	{ name: "Тип экрана", alias: "scr_type", type: 1 },
	{ name: "Диагональ экрана", alias: "scr_size", type: 3 },
	{ name: "Частота обновления экрана", alias: "scr_rr", type: 1 },
	{ name: "Производитель процессора", alias: "cpu_brand", type: 1 },
	{ name: "Модель процессора", alias: "cpu_model", type: 1 },
	{ name: "Количество ядер процессора", alias: "cpu_cores", type: 1 },
	{ name: "Частота процессора", alias: "cpu_speed", type: 3 },
	{ name: "Графический ускоритель", alias: "gpu_model", type: 1 },
	{ name: "Оперативная память", alias: "ram", type: 1 },
	{ name: "Внутренняя память", alias: "storage", type: 1 },
	{ name: "Поддержка карт памяти", alias: "ext_mem", type: 0 },
	{ name: "Количество тыловых камер", alias: "rcam_cnt", type: 1 },
	{ name: "Разрешение основной камеры", alias: "mcam_res", type: 1 },
	{ name: "Разрешение фронтальной камеры", alias: "fcam_res", type: 1 },
	{ name: "Оптическая стабилизация", alias: "cam_optstab", type: 0 },
	{ name: "Поддержка сетей 4G", alias: "gnet4", type: 0 },
	{ name: "Поддержка сетей 5G", alias: "gnet5", type: 0 },
	{ name: "Поддержка NFC", alias: "nfc", type: 0 },
	{ name: "Наличие FM Радио", alias: "fm_mod", type: 0 },
	{ name: "Интерфейс подключения", alias: "wire_type", type: 1 },
	{ name: "Емкость аккумулятора", alias: "btr_cap", type: 2 },
	{ name: "Мощность зарядного устройства", alias: "chrg_pwr", type: 1 },
];

export const category_attribute: Prisma.Category_attributeCreateInput[] = [
	{
		category: { connect: { id: 1 } },
		attributes: { connect: { id: 1 } },
	},
	{
		category: { connect: { id: 1 } },
		attributes: { connect: { id: 2 } },
	},
	{
		category: { connect: { id: 1 } },
		attributes: { connect: { id: 3 } },
	},
	{
		category: { connect: { id: 1 } },
		attributes: { connect: { id: 4 } },
	},
	{
		category: { connect: { id: 1 } },
		attributes: { connect: { id: 5 } },
	},
	{
		category: { connect: { id: 1 } },
		attributes: { connect: { id: 6 } },
	},
	{
		category: { connect: { id: 1 } },
		attributes: { connect: { id: 7 } },
	},
	{
		category: { connect: { id: 1 } },
		attributes: { connect: { id: 8 } },
	},
	{
		category: { connect: { id: 1 } },
		attributes: { connect: { id: 9 } },
	},
	{
		category: { connect: { id: 1 } },
		attributes: { connect: { id: 10 } },
	},
	{
		category: { connect: { id: 1 } },
		attributes: { connect: { id: 11 } },
	},
	{
		category: { connect: { id: 1 } },
		attributes: { connect: { id: 12 } },
	},
	{
		category: { connect: { id: 1 } },
		attributes: { connect: { id: 13 } },
	},
	{
		category: { connect: { id: 1 } },
		attributes: { connect: { id: 14 } },
	},
	{
		category: { connect: { id: 1 } },
		attributes: { connect: { id: 15 } },
	},
	{
		category: { connect: { id: 1 } },
		attributes: { connect: { id: 16 } },
	},
	{
		category: { connect: { id: 1 } },
		attributes: { connect: { id: 17 } },
	},
	{
		category: { connect: { id: 1 } },
		attributes: { connect: { id: 18 } },
	},
	{
		category: { connect: { id: 1 } },
		attributes: { connect: { id: 19 } },
	},
	{
		category: { connect: { id: 1 } },
		attributes: { connect: { id: 20 } },
	},
	{
		category: { connect: { id: 1 } },
		attributes: { connect: { id: 21 } },
	},
	{
		category: { connect: { id: 1 } },
		attributes: { connect: { id: 22 } },
	},
	{
		category: { connect: { id: 1 } },
		attributes: { connect: { id: 23 } },
	},
	{
		category: { connect: { id: 1 } },
		attributes: { connect: { id: 24 } },
	},
	{
		category: { connect: { id: 1 } },
		attributes: { connect: { id: 25 } },
	},
	{
		category: { connect: { id: 1 } },
		attributes: { connect: { id: 26 } },
	},
];
