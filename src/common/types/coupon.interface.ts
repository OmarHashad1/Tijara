import { DISCOUNT_TYPE } from 'src/common/enums';

export interface ICoupon {
  code: string;
  discountType: DISCOUNT_TYPE;
  discountValue: number;
  expiresAt: Date;
  usageLimit: number;
  timesUsed: number;
  createdAt?: Date;
  updatedAt?: Date;
}
