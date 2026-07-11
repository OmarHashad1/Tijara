import { Module } from '@nestjs/common';
import { CouponRepo } from 'src/common/repositories/coupon.repo';
import { CouponModel } from 'src/models';

@Module({
  imports: [CouponModel],
  providers: [CouponRepo],
  exports: [CouponRepo],
})
export class CouponModule {}
