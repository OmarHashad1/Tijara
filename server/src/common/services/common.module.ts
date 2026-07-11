import { Global, Module } from '@nestjs/common';
import { SecurityService } from './security';
import { RedisService } from './redis';
import { EmailService } from './email';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token';
import { S3Service } from './aws';
import { OtpService } from './otp';
import { PaymentService } from './payment';

@Global()
@Module({
  imports: [JwtModule],
  exports: [SecurityService, RedisService, EmailService, TokenService, S3Service, OtpService,PaymentService],
  providers: [
    SecurityService,
    RedisService,
    EmailService,
    TokenService,
    S3Service,
    OtpService,
PaymentService
  ],
})
export class CommonModule {}
