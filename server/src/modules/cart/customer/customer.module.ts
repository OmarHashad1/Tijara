import { Module } from '@nestjs/common';
import { ProductModule } from 'src/modules/product/product.module';
import { UserModule } from 'src/modules/user/user.module';
import { CartModule } from '../cart.module';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

@Module({
  imports: [CartModule, ProductModule, UserModule],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
