import { Module } from '@nestjs/common';
import { CartRepo } from 'src/common/repositories/cart.repo';
import { CartModel } from 'src/models';

@Module({
  imports: [CartModel],
  providers: [CartRepo],
  exports: [CartRepo],
})
export class CartModule {}
