import { Controller, Get, Param, Query } from '@nestjs/common';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from 'src/common/pipes';
import { ListReviewsQueryDto } from '../dto/list-reviews-query.dto';
import { GuestService } from './guest.service';

@Controller('products/:productId/reviews')
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  @Get()
  async listReviews(
    @Param('productId', ParseObjectIdPipe) productId: Types.ObjectId,
    @Query() query: ListReviewsQueryDto,
  ) {
    const payload = await this.guestService.listReviews(productId, query);
    return { message: 'Reviews fetched successfully', payload };
  }
}
