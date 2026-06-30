import {
  MongooseModule,
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DISCOUNT_TYPE } from 'src/common/enums';

import type { ICoupon } from 'src/common/types';

export type CouponDocument = HydratedDocument<ICoupon>;

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
  strict: true,
  strictQuery: true,
})
export class Coupon implements ICoupon {
  @Prop({
    type: String,
    required: true,
    unique: true,
    index: true,
    uppercase: true,
    trim: true,
  })
  code!: string;

  @Prop({
    type: String,
    enum: [...Object.values(DISCOUNT_TYPE)],
    required: true,
  })
  discountType!: DISCOUNT_TYPE;

  @Prop({ type: Number, required: true, min: 0 })
  discountValue!: number;

  @Prop({ type: Date, required: true, index: true })
  expiresAt!: Date;

  @Prop({ type: Number, required: true, min: 1 })
  usageLimit!: number;

  @Prop({ type: Number, default: 0, min: 0 })
  timesUsed!: number;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);

export const CouponModel = MongooseModule.forFeature([
  { name: Coupon.name, schema: CouponSchema },
]);
