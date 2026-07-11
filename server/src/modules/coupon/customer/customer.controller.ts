import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Auth } from 'src/common/decorators';
import { ROLE } from 'src/common/enums';
import { ValidateCouponDto } from '../dto/validate-coupon.dto';
import { CustomerService } from './customer.service';

@Controller('coupons')
@Auth([ROLE.USER])
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('/validate')
  @HttpCode(HttpStatus.OK)
  async validateCoupon(@Body() dto: ValidateCouponDto) {
    const payload = await this.customerService.validateCoupon(dto);
    return { message: 'Coupon is valid', payload };
  }
}
