import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { ProductRepo } from 'src/common/repositories/product.repo';
import { ReviewRepo } from 'src/common/repositories/review.repo';
import { ListReviewsQueryDto } from '../dto/list-reviews-query.dto';

@Injectable()
export class GuestService {
  constructor(
    private readonly reviewRepo: ReviewRepo,
    private readonly productRepo: ProductRepo,
  ) {}

  async listReviews(productId: Types.ObjectId, query: ListReviewsQueryDto) {
    const product = await this.productRepo.findOne({
      filter: { _id: productId },
      options: { lean: true },
    });
    if (!product) throw new NotFoundException('Product not found');

    const { page = 1, size = 20 } = query;
    return this.reviewRepo.paginate({
      filter: { productId },
      options: {},
      page,
      size,
    });
  }
}
