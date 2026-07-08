import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { DISCOUNT_TYPE } from 'src/common/enums';

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsEnum(DISCOUNT_TYPE)
  discountType!: DISCOUNT_TYPE;

  @IsNumber()
  @Min(0)
  discountValue!: number;

  @IsDateString()
  expiresAt!: string;

  @IsNumber()
  @Min(1)
  usageLimit!: number;
}
