import { Module } from '@nestjs/common';
import { ProductModule } from '../product.module';
import { GuestController } from './guest.controller';
import { GuestService } from './guest.service';

@Module({
  imports: [ProductModule],
  controllers: [GuestController],
  providers: [GuestService],
})
export class GuestModule {}
