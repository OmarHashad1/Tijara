import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsMatch, MatchFields } from 'src/decorators/match.decorator';
import { PROVIDER } from 'src/enums';

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(16)
  firstName!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(16)
  lastName!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsStrongPassword({
    minLength: 8,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  @IsNotEmpty()
  password!: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsDate()
  @IsOptional()
  DOB?: Date;

  @IsOptional()
  @IsEnum([PROVIDER.GOOGLE, PROVIDER.SYSTEM])
  provider?: PROVIDER;
}
