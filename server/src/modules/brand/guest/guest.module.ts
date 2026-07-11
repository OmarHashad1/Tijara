import { Module } from '@nestjs/common';
import { BrandModule } from '../brand.module';
import { GuestController } from './guest.controller';
import { GuestService } from './guest.service';

@Module({
  imports: [BrandModule],
  controllers: [GuestController],
  providers: [GuestService],
})
export class GuestModule {}
