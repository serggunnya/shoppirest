// import { PrismaClient, Prisma } from '@prisma/client';
import { categories } from "./data/categories";
import { Product_properties, products } from "./data/products";
import { Prisma, PrismaClient } from ".prisma/client";

const prisma = new PrismaClient();

const users: Prisma.UserCreateInput[] = [
	{
		username: "Admin admin",
		email: "admin@gmail.com",
		password:
			"$argon2i$v=19$m=4096,t=3,p=1$ZtyJl0CRjocXKfOVlokgaQ$Xq0kqgBVvGeDBeFUSFrVP/OBY+cEziu3yCnjkCJz8rs",
		role: "ADMIN",
	},
	{
		username: "User user",
		email: "user@gmail.com",
		password:
			"$argon2i$v=19$m=4096,t=3,p=1$ZtyJl0CRjocXKfOVlokgaQ$Xq0kqgBVvGeDBeFUSFrVP/OBY+cEziu3yCnjkCJz8rs",
		role: "USER",
	},
];

async function main() {
	console.log(`Start seeding ...`);
	for (const u of users) {
		const user = await prisma.user.create({ data: u });
		console.log(`Created user with id: ${user.id}`);
	}

	for (const cat of categories) {
		const category = await prisma.category.create({ data: cat });
		console.log(`Created category with id: ${category.id}`);
	}

	for (const p of products) {
		const product = await prisma.product.create({ data: p });
		console.log(`Created category with id: ${product.id}`);
	}

	for (const prop of Product_properties) {
		const property = await prisma.product_property.create({ data: prop });
		console.log(`Created property with id: ${property.id}`);
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
