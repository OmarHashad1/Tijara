import { Module } from '@nestjs/common';
import { ProductModule } from 'src/modules/product/product.module';
import { UserModule } from 'src/modules/user/user.module';
import { WishlistModule } from '../wishlist.module';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

@Module({
  imports: [WishlistModule, ProductModule, UserModule],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
