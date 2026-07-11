import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { ReviewRepo } from 'src/common/repositories/review.repo';
import { ListAdminReviewsQueryDto } from '../dto/list-admin-reviews-query.dto';

@Injectable()
export class AdminService {
  constructor(private readonly reviewRepo: ReviewRepo) {}

  async listReviews(query: ListAdminReviewsQueryDto) {
    const { productId, userId, rating, page = 1, size = 20 } = query;
    const filter: Record<string, unknown> = {};
    if (productId) filter.productId = new Types.ObjectId(productId);
    if (userId) filter.userId = new Types.ObjectId(userId);
    if (rating) filter.rating = rating;

    return this.reviewRepo.paginate({ filter, options: {}, page, size });
  }

  async deleteReview(id: Types.ObjectId) {
    const result = await this.reviewRepo.deleteOne({ filter: { _id: id } });
    if (!result.deletedCount) throw new NotFoundException('Review not found');
  }
}
