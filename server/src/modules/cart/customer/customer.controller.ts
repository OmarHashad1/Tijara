import {
  Body,
  Controller,
  Delete,
  Get,
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
import { AddCartItemDto } from '../dto/add-cart-item.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';
import { CustomerService } from './customer.service';

@Controller('cart')
@Auth([ROLE.USER])
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async getCart(@User() user: UserDocument) {
    const payload = await this.customerService.getCart(user._id);
    return { message: 'Cart fetched successfully', payload };
  }

  @Post('/items')
  async addItem(@User() user: UserDocument, @Body() dto: AddCartItemDto) {
    const payload = await this.customerService.addItem(user._id, dto);
    return { message: 'Item added to cart successfully', payload };
  }

  @Patch('/items/:productId')
  @HttpCode(HttpStatus.OK)
  async updateItemQuantity(
    @User() user: UserDocument,
    @Param('productId', ParseObjectIdPipe) productId: Types.ObjectId,
    @Body() dto: UpdateCartItemDto,
  ) {
    const payload = await this.customerService.updateItemQuantity(
      user._id,
      productId,
      dto,
    );
    return { message: 'Cart item updated successfully', payload };
  }

  @Delete('/items/:productId')
  async removeItem(
    @User() user: UserDocument,
    @Param('productId', ParseObjectIdPipe) productId: Types.ObjectId,
  ) {
    const payload = await this.customerService.removeItem(user._id, productId);
    return { message: 'Item removed from cart successfully', payload };
  }

  @Delete()
  async clearCart(@User() user: UserDocument) {
    await this.customerService.clearCart(user._id);
    return { message: 'Cart cleared successfully' };
  }
}
