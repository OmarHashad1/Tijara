import { Module } from '@nestjs/common';
import { OrderRepo } from 'src/common/repositories/order.repo';
import { PaymentRepo } from 'src/common/repositories/payment.repo';
import { OrderModel, PaymentModel } from 'src/models';
import { CouponModule } from '../coupon/coupon.module';

@Module({
  imports: [OrderModel,PaymentModel,CouponModule],
  providers: [OrderRepo,PaymentRepo],
  exports: [OrderRepo,PaymentRepo,CouponModule],
})
export class OrderModule {}
