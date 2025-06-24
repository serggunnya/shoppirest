import { Module } from "@nestjs/common";

import { CartController } from "cart/cart.controller";
import { CartService } from "cart/cart.service";

@Module({
	controllers: [CartController],
	providers: [CartService],
	exports: [CartService],
})
export class CartModule {}
