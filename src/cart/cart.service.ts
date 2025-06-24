import { BadRequestException, Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { ICartItem, ICartItemDTO, ISelectedItemsDto } from "./interfaces/cart.interface";

@Injectable()
export class CartService {
	constructor(private prisma: PrismaService) {}

	/**
	 * Метод получения товаров в корзине
	 * @param userId
	 * @param lang
	 * @returns Товары в карзине
	 */
	async getCartItems(userId: number, lang: string): Promise<ICartItem[]> {
		return (await this.prisma.$queryRaw`
			select c.id, ci.product_id, ci.quantity, p.sku, 
				p.slug, pt."name", p.stock, p.price::int, p.discount, 
				json_agg(
					json_build_object('id', pi.id, 'url', pi.url, 'order', pi.order)
				) as images
			from carts c
			join cart_items ci on ci.cart_id = c.id
			join products p on p.id = ci.product_id
				and p.is_active = true
			left join product_translations pt on pt.product_id = p.id 
				and pt.locale = ${lang}
			left join product_images pi on pi.product_id = p.id 
			where c.user_id = ${userId}
			group by 
				c.id, ci.product_id, ci.quantity, p.sku, 
				p.slug, pt."name", p.stock, p.price, p.discount
			`) as ICartItem[];
	}

	/**
	 * Метод получения отзывов по id продукта
	 * @param params {page, product, sortBy}
	 * @returns Отзывы по id продукта
	 */
	async addItem(item: ICartItemDTO) {
		return await this.prisma.carts.create({
			data: {
				user_id: item.userId,
				items: {
					create: {
						product_id: item.productId,
						quantity: 1,
					},
				},
			},
		});
	}

	async updateQuantity(userId: number, itemId: number) {
		return await this.prisma.carts.update({
			where: { user_id: userId },
			data: {
				items: {
					update: {
						where: { id: itemId },
						data: { quantity: { increment: 1 } },
					},
				},
			},
		});
	}

	async deleteItem(userId: number, itemId: number) {
		return await this.prisma.carts.update({
			where: { user_id: userId },
			data: { items: { delete: { id: itemId } } },
		});
	}

	async merge(userId: number, guestCart: Record<string, any>) {}

	async checkout(userId: number, selectedItems: ISelectedItemsDto[]) {
		// Если не выбрано ни одного товара, выбрасываем ошибку
		if (!selectedItems || selectedItems.length === 0) {
			throw new BadRequestException("Не выбрано ни одного товара для оформления заказа");
		}

		// Получаем корзину пользователя
		const cart = await this.prisma.carts.findUnique({
			where: { user_id: userId },
			include: {
				items: {
					include: { product: true },
				},
			},
		});

		if (!cart || cart.items.length === 0) {
			throw new BadRequestException("Корзина пуста");
		}

		// Создаем карту выбранных товаров для быстрого доступа
		const selectedItemsMap = new Map(selectedItems.map((item) => [item.itemId, item.quantity]));

		// Проверяем и подготавливаем товары для заказа
		const itemsForOrder = [];

		for (const cartItem of cart.items) {
			// Проверяем, выбран ли этот товар для заказа
			if (selectedItemsMap.has(cartItem.id)) {
				const requestedQuantity = selectedItemsMap.get(cartItem.id);

				// Проверяем, что запрошенное количество не превышает количество в корзине
				if (requestedQuantity > cartItem.quantity) {
					throw new BadRequestException(
						`Запрошенное количество товара ${cartItem.product.sku} (${requestedQuantity}) превышает количество в корзине (${cartItem.quantity})`,
					);
				}

				// Проверяем наличие товара на складе
				if (requestedQuantity > cartItem.product.stock) {
					throw new BadRequestException(
						`Недостаточно товара ${cartItem.product.sku} на складе. Доступно: ${cartItem.product.stock}`,
					);
				}

				// Добавляем товар в список для заказа
				itemsForOrder.push({
					cartItem,
					requestedQuantity,
				});
			}
		}

		if (itemsForOrder.length === 0) {
			throw new BadRequestException("Ни один из выбранных товаров не найден в корзине");
		}

		// Вычисляем общую сумму заказа
		const total = itemsForOrder.reduce(
			(sum, item) => sum + item.cartItem.price * item.requestedQuantity,
			0,
		);

		return {itemsForOrder, total}
	}
}
