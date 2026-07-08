import { Module } from '@nestjs/common';
import { ProductModule } from 'src/modules/product/product.module';
import { ReviewModule } from '../review.module';
import { GuestController } from './guest.controller';
import { GuestService } from './guest.service';

@Module({
  imports: [ReviewModule, ProductModule],
  controllers: [GuestController],
  providers: [GuestService],
})
export class GuestModule {}
