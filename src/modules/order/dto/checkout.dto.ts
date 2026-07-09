import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PAYMENT_PROVIDER } from 'src/common/enums';

export class CheckoutDto {
  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsOptional()
  @IsEnum(PAYMENT_PROVIDER)
  provider?: PAYMENT_PROVIDER;
}

