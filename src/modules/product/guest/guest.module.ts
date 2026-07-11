import { Module } from '@nestjs/common';
import { ProductModule } from '../product.module';
import { GuestController } from './guest.controller';
import { GuestService } from './guest.service';
import { GuestResolver } from './guest.resolver';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [ProductModule,UserModule],
  controllers: [GuestController],
  providers: [GuestService, GuestResolver],
})
export class GuestModule {}
