import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { CartRepo } from 'src/common/repositories/cart.repo';
import { ProductRepo } from 'src/common/repositories/product.repo';
import { AddCartItemDto } from '../dto/add-cart-item.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';

@Injectable()
export class CustomerService {
  constructor(
    private readonly cartRepo: CartRepo,
    private readonly productRepo: ProductRepo,
  ) {}

  private async findOrCreateCart(userId: Types.ObjectId) {
    const cart = await this.cartRepo.findOne({
      filter: { userId },
      options: { lean: true },
    });
    if (cart) return cart;
    return this.cartRepo.create({ data: { userId, items: [] } });
  }

  async getCart(userId: Types.ObjectId) {
    return this.findOrCreateCart(userId);
  }

  async addItem(userId: Types.ObjectId, dto: AddCartItemDto) {
    const product = await this.productRepo.findOne({
      filter: { _id: dto.productId },
      options: { lean: true },
    });
    if (!product) throw new NotFoundException('Product not found');

    const cart = await this.findOrCreateCart(userId);
    const productId = new Types.ObjectId(dto.productId);
    const hasItem = cart.items.some(
      (item) => item.productId.toString() === dto.productId,
    );

    if (hasItem) {
      await this.cartRepo.updateOne({
        filter: { userId, 'items.productId': productId },
        update: { $inc: { 'items.$.quantity': dto.quantity } },
      });
    } else {
      await this.cartRepo.updateOne({
        filter: { userId },
        update: { $push: { items: { productId, quantity: dto.quantity } } },
      });
    }

    return this.cartRepo.findOne({ filter: { userId }, options: { lean: true } });
  }

  async updateItemQuantity(
    userId: Types.ObjectId,
    productId: Types.ObjectId,
    dto: UpdateCartItemDto,
  ) {
    const result = await this.cartRepo.updateOne({
      filter: { userId, 'items.productId': productId },
      update: { $set: { 'items.$.quantity': dto.quantity } },
    });
    if (!result.matchedCount)
      throw new NotFoundException('Cart item not found');

    return this.cartRepo.findOne({ filter: { userId }, options: { lean: true } });
  }

  async removeItem(userId: Types.ObjectId, productId: Types.ObjectId) {
    const result = await this.cartRepo.updateOne({
      filter: { userId },
      update: { $pull: { items: { productId } } },
    });
    if (!result.matchedCount) throw new NotFoundException('Cart not found');

    return this.cartRepo.findOne({ filter: { userId }, options: { lean: true } });
  }

  async clearCart(userId: Types.ObjectId) {
    await this.findOrCreateCart(userId);
    await this.cartRepo.updateOne({
      filter: { userId },
      update: { $set: { items: [] } },
    });
  }
}
