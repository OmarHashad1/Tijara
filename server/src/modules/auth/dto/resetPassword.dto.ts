import { IsNotEmpty, IsStrongPassword } from 'class-validator';
import { ForgotPasswordOtp } from './forgotPasswordOtp.dto';

export class ForgotPassword extends ForgotPasswordOtp {
  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  @IsNotEmpty()
  newPassword!: string;
}
