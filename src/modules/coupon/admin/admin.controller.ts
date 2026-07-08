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
  Query,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { Auth } from 'src/common/decorators';
import { ROLE } from 'src/common/enums';
import { ParseObjectIdPipe } from 'src/common/pipes';
import { CreateCouponDto } from '../dto/create-coupon.dto';
import { UpdateCouponDto } from '../dto/update-coupon.dto';
import { ListCouponsQueryDto } from '../dto/list-coupons-query.dto';
import { AdminService } from './admin.service';

@Controller('admin/coupons')
@Auth([ROLE.ADMIN])
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  async listCoupons(@Query() query: ListCouponsQueryDto) {
    const payload = await this.adminService.listCoupons(query);
    return { message: 'Coupons fetched successfully', payload };
  }

  @Post()
  async createCoupon(@Body() dto: CreateCouponDto) {
    const payload = await this.adminService.createCoupon(dto);
    return { message: 'Coupon created successfully', payload };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateCoupon(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() dto: UpdateCouponDto,
  ) {
    const payload = await this.adminService.updateCoupon(id, dto);
    return { message: 'Coupon updated successfully', payload };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteCoupon(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    await this.adminService.deleteCoupon(id);
    return { message: 'Coupon deleted successfully' };
  }
}
