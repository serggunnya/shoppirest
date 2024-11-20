import { Prisma } from ".prisma/client";

export const categories: Prisma.CategoryCreateInput[] = [
	{ name: "Телефоны" },
	{ name: "Телевизоры" },
	{ name: "Ноутбуки" },
	{ name: "Видеокарты" },
	{ name: "материнские платы" },
];

export const attributes: Prisma.AttributeCreateInput[] = [
	{ name: "Производитель", alias: "brand" },
	{ name: "Операционная система", alias: "os" },
	{ name: "Количество ядер", alias: "cores" },
	{ name: "Производитель процессора", alias: "core_brand" },
	{ name: "Графический ускоритель", alias: "gpu" },
	{ name: "Тип экрана", alias: "screen" },
	{ name: "Частота обновления экрана", alias: "screen_rate" },
	{ name: "Внутренняя память", alias: "storage" },
	{ name: "Оперативная память", alias: "ram" },
	{ name: "Проводной интерфейс", alias: "interface" },
	{ name: "Быстрая зарядка", alias: "charger" },
];
