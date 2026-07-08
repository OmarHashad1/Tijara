import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { OrderRepo } from 'src/common/repositories/order.repo';
import { ProductRepo } from 'src/common/repositories/product.repo';
import { ReviewRepo } from 'src/common/repositories/review.repo';
import { ORDER_STATUS } from 'src/common/enums';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';

@Injectable()
export class CustomerService {
  constructor(
    private readonly reviewRepo: ReviewRepo,
    private readonly orderRepo: OrderRepo,
    private readonly productRepo: ProductRepo,
  ) {}

  async createReview(
    userId: Types.ObjectId,
    productId: Types.ObjectId,
    dto: CreateReviewDto,
  ) {
    const product = await this.productRepo.findOne({
      filter: { _id: productId },
      options: { lean: true },
    });
    if (!product) throw new NotFoundException('Product not found');

    const order = await this.orderRepo.findOne({
      filter: { _id: dto.orderId, userId },
      options: { lean: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== ORDER_STATUS.DELIVERED)
      throw new BadRequestException(
        'You can only review products from delivered orders',
      );
    if (
      !order.items.some(
        (item) => item.productId.toString() === productId.toString(),
      )
    )
      throw new BadRequestException(
        'This product was not part of the given order',
      );

    const existingReview = await this.reviewRepo.findOne({
      filter: { userId, productId },
      options: { lean: true },
    });
    if (existingReview)
      throw new ConflictException('You have already reviewed this product');

    const payload = await this.reviewRepo.create({
      data: {
        userId,
        productId,
        orderId: new Types.ObjectId(dto.orderId),
        rating: dto.rating,
        comment: dto.comment ?? null,
      },
    });
    return payload;
  }

  async updateReview(
    userId: Types.ObjectId,
    id: Types.ObjectId,
    dto: UpdateReviewDto,
  ) {
    const review = await this.reviewRepo.findOne({
      filter: { _id: id, userId },
      options: { lean: true },
    });
    if (!review) throw new NotFoundException('Review not found');

    const update: Partial<{ rating: number; comment: string | null }> = {};
    if (dto.rating !== undefined) update.rating = dto.rating;
    if (dto.comment !== undefined) update.comment = dto.comment;

    const payload = await this.reviewRepo.findOneAndUpdate({
      filter: { _id: id },
      update: { $set: update },
      options: { new: true },
    });
    return payload;
  }

  async deleteReview(userId: Types.ObjectId, id: Types.ObjectId) {
    const result = await this.reviewRepo.deleteOne({
      filter: { _id: id, userId },
    });
    if (!result.deletedCount) throw new NotFoundException('Review not found');
  }
}
