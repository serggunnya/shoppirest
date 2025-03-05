// import { PrismaClient, Prisma } from '@prisma/client';
import { attributes, categories, category_attribute } from "./data/categories";
import { products } from "./data/products";
import { Prisma, PrismaClient } from ".prisma/client";

const prisma = new PrismaClient();

const users: Prisma.UsersCreateInput[] = [
	{
		username: "Admin admin",
		email: "admin@gmail.com",
		password:
			"$argon2i$v=19$m=4096,t=3,p=1$ZtyJl0CRjocXKfOVlokgaQ$Xq0kqgBVvGeDBeFUSFrVP/OBY+cEziu3yCnjkCJz8rs",
		role: "ROLE_ADMIN",
	},
	{
		username: "User user",
		email: "user@gmail.com",
		password:
			"$argon2i$v=19$m=4096,t=3,p=1$ZtyJl0CRjocXKfOVlokgaQ$Xq0kqgBVvGeDBeFUSFrVP/OBY+cEziu3yCnjkCJz8rs",
		role: "ROLE_USER",
	},
];

async function main() {
	console.log(`Start seeding ...`);
	for (const u of users) {
		const user = await prisma.users.create({ data: u });
		console.log(`Created user with id: ${user.id}`);
	}

	for (const cat of categories) {
		const category = await prisma.category.create({ data: cat });
		console.log(`Created category with id: ${category.id}`);
	}

	for (const attr of attributes) {
		const attribute = await prisma.attribute.create({ data: attr });
		console.log(`Created attribute with id: ${attribute.id}`);
	}

	for (const ca of category_attribute) {
		const cat_attr = await prisma.category_attribute.create({ data: ca });
		console.log(`Created cat_attr with id: ${cat_attr.id}`);
	}

	for (const p of products) {
		const product = await prisma.product.create({ data: p });
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
