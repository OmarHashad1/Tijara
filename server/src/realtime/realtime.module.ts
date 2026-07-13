import { Module } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway';
import { CommonModule } from 'src/common/services';
import { UserModule } from 'src/modules/user/user.module';
import { AuthenticationGuard } from 'src/common/guards/auth';

@Module({
  imports:[UserModule],
  providers: [RealtimeGateway,AuthenticationGuard],
})
export class RealtimeModule {}
