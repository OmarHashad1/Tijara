import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordOtp {
  @IsNotEmpty()
  @IsEmail()
  email!: string;
}
