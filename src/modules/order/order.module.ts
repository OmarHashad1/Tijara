import { Module } from '@nestjs/common';
import { OrderRepo } from 'src/common/repositories/order.repo';
import { PaymentRepo } from 'src/common/repositories/payment.repo';
import { OrderModel, PaymentModel } from 'src/models';

@Module({
  imports: [OrderModel,PaymentModel],
  providers: [OrderRepo,PaymentRepo],
  exports: [OrderRepo,PaymentRepo],
})
export class OrderModule {}
