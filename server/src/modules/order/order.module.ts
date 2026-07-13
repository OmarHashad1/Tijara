import { Module } from '@nestjs/common';
import { OrderRepo } from 'src/common/repositories/order.repo';
import { PaymentRepo } from 'src/common/repositories/payment.repo';
import { OrderModel, PaymentModel } from 'src/models';
import { CouponModule } from '../coupon/coupon.module';
import { RealtimeModule } from 'src/realtime/realtime.module';

@Module({
  imports: [OrderModel,PaymentModel,CouponModule,RealtimeModule],
  providers: [OrderRepo,PaymentRepo],
  exports: [OrderRepo,PaymentRepo,CouponModule,RealtimeModule],
})
export class OrderModule {}
