import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminResolver } from './admin.resolver';
import { CategoryModule } from '../category.module';
import { UserModule } from 'src/modules/user/user.module';
import { BrandModule } from 'src/modules/brand/brand.module';

@Module({
  imports: [CategoryModule, UserModule, BrandModule],
  exports: [],
  providers: [AdminService, AdminResolver],
})
export class AdminModule {}
