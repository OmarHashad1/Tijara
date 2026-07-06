import { Module } from '@nestjs/common';
import { CategoryModule } from 'src/modules/category/category.module';
import { UserModule } from 'src/modules/user/user.module';
import { BrandModule } from '../brand.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [BrandModule, CategoryModule, UserModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
