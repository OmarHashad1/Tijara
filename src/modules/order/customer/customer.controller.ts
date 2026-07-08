import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { Auth, User } from 'src/common/decorators';
import { ROLE } from 'src/common/enums';
import { ParseObjectIdPipe } from 'src/common/pipes';
import { type UserDocument } from 'src/models';
import { CheckoutDto } from '../dto/checkout.dto';
import { ListOrdersQueryDto } from '../dto/list-orders-query.dto';
import { CustomerService } from './customer.service';

@Controller('orders')
@Auth([ROLE.USER])
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async checkout(@User() user: UserDocument, @Body() dto: CheckoutDto) {
    const payload = await this.customerService.checkout(user._id, dto);
    return { message: 'Order placed successfully', payload };
  }

  @Get()
  async listOrders(
    @User() user: UserDocument,
    @Query() query: ListOrdersQueryDto,
  ) {
    const payload = await this.customerService.listOrders(user._id, query);
    return { message: 'Orders fetched successfully', payload };
  }

  @Get('/:id')
  async getOrder(
    @User() user: UserDocument,
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ) {
    const payload = await this.customerService.getOrder(user._id, id);
    return { message: 'Order fetched successfully', payload };
  }

  @Patch('/:id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancelOrder(
    @User() user: UserDocument,
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ) {
    const payload = await this.customerService.cancelOrder(user._id, id);
    return { message: 'Order cancelled successfully', payload };
  }
}
