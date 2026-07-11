import { Module } from '@nestjs/common';
import { UserModule } from 'src/modules/user/user.module';
import { CouponModule } from '../coupon.module';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

@Module({
  imports: [CouponModule, UserModule],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
