import { Global, Module } from '@nestjs/common';
import { SecurityService } from './security';
import { RedisService } from './redis';
import { EmailService } from './email';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token';

@Global()
@Module({
  imports: [JwtModule],
  exports: [SecurityService, RedisService, EmailService, TokenService],
  providers: [SecurityService, RedisService, EmailService, TokenService],
})
export class CommonModule {}
