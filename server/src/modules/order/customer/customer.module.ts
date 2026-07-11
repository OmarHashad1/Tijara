import { Module } from '@nestjs/common';
import { CartModule } from 'src/modules/cart/cart.module';
import { ProductModule } from 'src/modules/product/product.module';
import { UserModule } from 'src/modules/user/user.module';
import { OrderModule } from '../order.module';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { PaymentRepo } from 'src/common/repositories/payment.repo';

@Module({
  imports: [OrderModule, CartModule, ProductModule, UserModule,],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
