import { Module } from '@nestjs/common';
import { ProductModule } from 'src/modules/product/product.module';
import { UserModule } from 'src/modules/user/user.module';
import { OrderModule } from '../order.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [OrderModule, ProductModule, UserModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
