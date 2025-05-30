import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { CategoryModule } from "category/category.module";
import { join } from "path";
import { ReviewModule } from "review/review.module";

import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ProductModule } from "./product/product.module";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		CacheModule.register({ isGlobal: true }),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, "..", "public"),
		}),
		CategoryModule,
		ProductModule,
		ReviewModule,
		AuthModule,
		PrismaModule,
	],
})
export class AppModule {}
