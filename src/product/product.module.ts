import { Module } from "@nestjs/common";

import { CategoryModule } from "category/category.module";

import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";

@Module({
	controllers: [ProductController],
	providers: [ProductService],
	imports: [CategoryModule],
})
export class ProductModule {}
