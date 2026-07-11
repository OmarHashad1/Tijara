import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { Auth, User } from 'src/common/decorators';
import { ROLE } from 'src/common/enums';
import { ParseObjectIdPipe } from 'src/common/pipes';
import { type UserDocument } from 'src/models';
import { AddWishlistItemDto } from '../dto/add-wishlist-item.dto';
import { CustomerService } from './customer.service';

@Controller('wishlist')
@Auth([ROLE.USER])
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async getWishlist(@User() user: UserDocument) {
    const payload = await this.customerService.getWishlist(user._id);
    return { message: 'Wishlist fetched successfully', payload };
  }

  @Post('/items')
  async addItem(@User() user: UserDocument, @Body() dto: AddWishlistItemDto) {
    const payload = await this.customerService.addItem(user._id, dto);
    return { message: 'Item added to wishlist successfully', payload };
  }

  @Delete('/items/:productId')
  async removeItem(
    @User() user: UserDocument,
    @Param('productId', ParseObjectIdPipe) productId: Types.ObjectId,
  ) {
    const payload = await this.customerService.removeItem(user._id, productId);
    return { message: 'Item removed from wishlist successfully', payload };
  }
}
