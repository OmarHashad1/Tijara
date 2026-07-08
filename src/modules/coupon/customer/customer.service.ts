import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CouponRepo } from 'src/common/repositories/coupon.repo';
import { ValidateCouponDto } from '../dto/validate-coupon.dto';

@Injectable()
export class CustomerService {
  constructor(private readonly couponRepo: CouponRepo) {}

  async validateCoupon(dto: ValidateCouponDto) {
    const coupon = await this.couponRepo.findOne({
      filter: { code: dto.code.trim().toUpperCase() },
      options: { lean: true },
    });
    if (!coupon) throw new NotFoundException('Coupon not found');
    if (coupon.expiresAt < new Date())
      throw new BadRequestException('Coupon has expired');
    if (coupon.timesUsed >= coupon.usageLimit)
      throw new BadRequestException('Coupon usage limit reached');

    return coupon;
  }
}
