import { Module } from '@nestjs/common';
import { BrandModule } from 'src/modules/brand/brand.module';
import { CategoryModule } from 'src/modules/category/category.module';
import { UserModule } from 'src/modules/user/user.module';
import { ProductModule } from '../product.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [ProductModule, CategoryModule, BrandModule, UserModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
