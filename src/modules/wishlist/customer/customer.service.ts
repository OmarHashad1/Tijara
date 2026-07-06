import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { ProductRepo } from 'src/common/repositories/product.repo';
import { WishlistRepo } from 'src/common/repositories/wishlist.repo';
import { AddWishlistItemDto } from '../dto/add-wishlist-item.dto';

@Injectable()
export class CustomerService {
  constructor(
    private readonly wishlistRepo: WishlistRepo,
    private readonly productRepo: ProductRepo,
  ) {}

  private async findOrCreateWishlist(userId: Types.ObjectId) {
    const wishlist = await this.wishlistRepo.findOne({
      filter: { userId },
      options: { lean: true },
    });
    if (wishlist) return wishlist;
    return this.wishlistRepo.create({ data: { userId, productIds: [] } });
  }

  async getWishlist(userId: Types.ObjectId) {
    return this.findOrCreateWishlist(userId);
  }

  async addItem(userId: Types.ObjectId, dto: AddWishlistItemDto) {
    const product = await this.productRepo.findOne({
      filter: { _id: dto.productId },
      options: { lean: true },
    });
    if (!product) throw new NotFoundException('Product not found');

    await this.findOrCreateWishlist(userId);
    await this.wishlistRepo.updateOne({
      filter: { userId },
      update: { $addToSet: { productIds: new Types.ObjectId(dto.productId) } },
    });

    return this.wishlistRepo.findOne({
      filter: { userId },
      options: { lean: true },
    });
  }

  async removeItem(userId: Types.ObjectId, productId: Types.ObjectId) {
    const result = await this.wishlistRepo.updateOne({
      filter: { userId },
      update: { $pull: { productIds: productId } },
    });
    if (!result.matchedCount)
      throw new NotFoundException('Wishlist not found');

    return this.wishlistRepo.findOne({
      filter: { userId },
      options: { lean: true },
    });
  }
}
