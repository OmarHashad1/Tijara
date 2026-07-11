import { Module } from '@nestjs/common';
import { OrderModule } from 'src/modules/order/order.module';
import { ProductModule } from 'src/modules/product/product.module';
import { UserModule } from 'src/modules/user/user.module';
import { ReviewModule } from '../review.module';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

@Module({
  imports: [ReviewModule, OrderModule, ProductModule, UserModule],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
