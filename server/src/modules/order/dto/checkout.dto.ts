import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PAYMENT_PROVIDER } from 'src/common/enums';

export class CheckoutDto {
  @IsNotEmpty()
  @IsMongoId()
  addressId!: string;

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsOptional()
  @IsEnum(PAYMENT_PROVIDER)
  provider?: PAYMENT_PROVIDER;
}

