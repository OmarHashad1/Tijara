import { Module } from '@nestjs/common';
import { UserModule } from 'src/modules/user/user.module';
import { CouponModule } from '../coupon.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [CouponModule, UserModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
