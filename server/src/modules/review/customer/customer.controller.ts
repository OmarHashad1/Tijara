import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { Auth, User } from 'src/common/decorators';
import { ROLE } from 'src/common/enums';
import { ParseObjectIdPipe } from 'src/common/pipes';
import { type UserDocument } from 'src/models';
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { CustomerService } from './customer.service';

@Controller()
@Auth([ROLE.USER])
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('products/:productId/reviews')
  async createReview(
    @User() user: UserDocument,
    @Param('productId', ParseObjectIdPipe) productId: Types.ObjectId,
    @Body() dto: CreateReviewDto,
  ) {
    const payload = await this.customerService.createReview(
      user._id,
      productId,
      dto,
    );
    return { message: 'Review submitted successfully', payload };
  }

  @Patch('reviews/:id')
  @HttpCode(HttpStatus.OK)
  async updateReview(
    @User() user: UserDocument,
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() dto: UpdateReviewDto,
  ) {
    const payload = await this.customerService.updateReview(
      user._id,
      id,
      dto,
    );
    return { message: 'Review updated successfully', payload };
  }

  @Delete('reviews/:id')
  @HttpCode(HttpStatus.OK)
  async deleteReview(
    @User() user: UserDocument,
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ) {
    await this.customerService.deleteReview(user._id, id);
    return { message: 'Review deleted successfully' };
  }
}
