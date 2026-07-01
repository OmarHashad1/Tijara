import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { UserModule } from '../user.module';

@Module({
  imports: [UserModule],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
