import { ParseIntPipe } from '@nestjs/common';
import {
  IsEmail,
  IsNumber,
  IsPositive,
  IsString,
  IsStrongPassword,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class SingupDto {
  @IsString()
  @MinLength(3)
  @MaxLength(16)
  firstName!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(16)
  lastName!: string;

  @IsEmail({})
  email!: string;

  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password!: string;

  @IsNumber()
  @IsPositive()
  @Min(16)
  @Max(95)
  age!: number;
}
