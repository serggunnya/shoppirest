import {
	Body,
	Controller,
	Delete,
	Param,
	ParseIntPipe,
	Post,
	Put,
	Request,
	UseGuards,
	Version,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { RequestWithUser } from "auth/interfaces/auth.interface";
import { CartService } from "./cart.service";
import { CartItemDTO } from "./dto/CartItemDTO";
import { MergeCartDTO } from "./dto/MergeCartDTO";
import { SelectedItemsDto } from "./dto/SelectedItemsDto";

@ApiTags("Cart")
@Controller("cart")
export class CartController {
	constructor(private cartService: CartService) {}

	@Post("/items")
	@Version("1")
	@ApiBearerAuth()
	@UseGuards(AuthGuard("jwt"))
	@ApiOperation({ summary: "Add product item to cart", operationId: "2" })
	@ApiResponse({ status: 200 })
	addItem(@Body() item: CartItemDTO) {
		return this.cartService.addItem(item);
	}

	@Put("/items/:itemId")
	@Version("1")
	@ApiBearerAuth()
	@UseGuards(AuthGuard("jwt"))
	@ApiResponse({ status: 200 })
	@ApiOperation({ summary: "Change quantity of item in cart", operationId: "3" })
	updateQuantity(@Request() req: RequestWithUser, @Param("itemId", ParseIntPipe) itemId: number) {
		return this.cartService.updateQuantity(req.user.userId, itemId);
	}

	@Delete("/items/:itemId")
	@Version("1")
	@ApiBearerAuth()
	@UseGuards(AuthGuard("jwt"))
	@ApiResponse({ status: 200 })
	@ApiOperation({ summary: "Delete item from cart", operationId: "4" })
	deleteItem(@Request() req: RequestWithUser, @Param("itemId", ParseIntPipe) itemId: number) {
		return this.cartService.deleteItem(req.user.userId, itemId);
	}

	@Post("/merge")
	@Version("1")
	@ApiBearerAuth()
	@UseGuards(AuthGuard("jwt"))
	@ApiResponse({ status: 200 })
	@ApiOperation({ summary: "Merge guest cart with user cart", operationId: "5" })
	merge(@Request() req: RequestWithUser, @Body() mergeData: MergeCartDTO) {
		return this.cartService.merge(req.user.userId, mergeData.guestCartItems);
	}

	@Post("/checkout")
	@Version("1")
	@ApiBearerAuth()
	@UseGuards(AuthGuard("jwt"))
	@ApiBody({ type: SelectedItemsDto, isArray: true })
	@ApiResponse({ status: 200 })
	@ApiOperation({ summary: "Make order", operationId: "6" })
	checkout(@Request() req: RequestWithUser, @Body() selectedItems: SelectedItemsDto[]) {
		return this.cartService.checkout(req.user.userId, selectedItems);
	}
}
