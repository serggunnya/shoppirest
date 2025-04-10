import { Prisma, PrismaClient } from "@prisma/client";

import { attributeUnits, attributes, categoryAttributes, units } from "./data/attributes";
import { categories } from "./data/categories";
import { products } from "./data/products";

const prisma = new PrismaClient();

const users: Prisma.usersCreateInput[] = [
	{
		email: "admin@gmail.com",
		password:
			"$argon2i$v=19$m=4096,t=3,p=1$ZtyJl0CRjocXKfOVlokgaQ$Xq0kqgBVvGeDBeFUSFrVP/OBY+cEziu3yCnjkCJz8rs",
		role: "ADMIN",
	},
	{
		email: "user@gmail.com",
		password:
			"$argon2i$v=19$m=4096,t=3,p=1$ZtyJl0CRjocXKfOVlokgaQ$Xq0kqgBVvGeDBeFUSFrVP/OBY+cEziu3yCnjkCJz8rs",
		role: "CUSTOMER",
	},
];

async function main() {
	console.log(`Start seeding ...`);
	for (const u of users) {
		const user = await prisma.users.create({ data: u });
		console.log(`Created user with id: ${user.id}`);
	}

	for (const cat of categories) {
		const category = await prisma.categories.create({ data: cat });
		console.log(`Created category with id: ${category.id}`);
	}

	for (const attr of attributes) {
		const attribute = await prisma.attributes.create({ data: attr });
		console.log(`Created attribute with id: ${attribute.id}`);
	}

	for (const ca of categoryAttributes) {
		const cat_attr = await prisma.category_attributes.create({ data: ca });
		console.log(`Created category_attribute connection with id: ${cat_attr.id}`);
	}

	for (const u of units) {
		const unit = await prisma.units.create({ data: u });
		console.log(`Created unit with id: ${unit.id}`);
	}

	for (const au of attributeUnits) {
		const unit = await prisma.attribute_units.create({ data: au });
		console.log(`Created attribute_unit connection  with id: ${unit.id}`);
	}

	for (const p of products) {
		const product = await prisma.products.create({ data: p });
		console.log(`Created product with id: ${product.id}`);
	}

	console.log(`Seeding finished.`);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
