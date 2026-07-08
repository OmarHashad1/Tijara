import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { Auth } from 'src/common/decorators';
import { ROLE } from 'src/common/enums';
import { ParseObjectIdPipe } from 'src/common/pipes';
import { ListAdminOrdersQueryDto } from '../dto/list-admin-orders-query.dto';
import { UpdateOrderStatusDto } from '../dto/update-order-status.dto';
import { AdminService } from './admin.service';

@Controller('admin/orders')
@Auth([ROLE.ADMIN])
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  async listOrders(@Query() query: ListAdminOrdersQueryDto) {
    const payload = await this.adminService.listOrders(query);
    return { message: 'Orders fetched successfully', payload };
  }

  @Get(':id')
  async getOrder(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    const payload = await this.adminService.getOrder(id);
    return { message: 'Order fetched successfully', payload };
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    const payload = await this.adminService.updateStatus(id, dto);
    return { message: 'Order status updated successfully', payload };
  }
}
