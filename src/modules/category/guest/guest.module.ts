import { Module } from '@nestjs/common';
import { CategoryModule } from '../category.module';
import { GuestController } from './guest.controller';
import { GuestService } from './guest.service';
import { BrandModule } from 'src/modules/brand/brand.module';

@Module({
  imports: [CategoryModule, BrandModule],
  controllers: [GuestController],
  providers: [GuestService],
})
export class GuestModule {}
