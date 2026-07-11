import { IsBoolean, IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { PAYMENT_METHOD } from 'src/common/enums';

export class AddPaymentMethodDto {
  @IsEnum(PAYMENT_METHOD)
  method!: PAYMENT_METHOD;

  @IsInt()
  @Min(1000)
  @Max(9999)
  last4!: number;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
