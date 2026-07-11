import { IsNotEmpty, IsString, Length, MinLength } from 'class-validator';
import { ForgotPasswordOtp } from './forgotPasswordOtp.dto';

export class verfiyForgotPasswordOtp extends ForgotPasswordOtp {
  @IsNotEmpty()
  @IsString()
  @Length(6)
  otp!: string;
}
