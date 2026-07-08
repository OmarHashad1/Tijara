import { Module } from '@nestjs/common';
import { OrderRepo } from 'src/common/repositories/order.repo';
import { OrderModel } from 'src/models';

@Module({
  imports: [OrderModel],
  providers: [OrderRepo],
  exports: [OrderRepo],
})
export class OrderModule {}
