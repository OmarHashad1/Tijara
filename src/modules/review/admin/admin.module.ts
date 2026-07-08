import { Module } from '@nestjs/common';
import { UserModule } from 'src/modules/user/user.module';
import { ReviewModule } from '../review.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [ReviewModule, UserModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
