import {
  MongooseModule,
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { PAYMENT_PROVIDER, PAYMENT_STATUS } from 'src/common/enums';

import type { IPayment } from 'src/common/types';

export type PaymentDocument = HydratedDocument<IPayment>;

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
  strict: true,
  strictQuery: true,
})
export class Payment implements IPayment {
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true, index: true })
  orderId!: Types.ObjectId;

  @Prop({ type: Number, required: true, min: 0 })
  amount!: number;

  @Prop({
    type: String,
    enum: [...Object.values(PAYMENT_STATUS)],
    default: PAYMENT_STATUS.PENDING,
    index: true,
  })
  status!: PAYMENT_STATUS;

  @Prop({
    type: String,
    enum: [...Object.values(PAYMENT_PROVIDER)],
    required: true,
  })
  provider!: PAYMENT_PROVIDER;

  @Prop({
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true,
  })
  transactionRef!: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

export const PaymentModel = MongooseModule.forFeature([
  { name: Payment.name, schema: PaymentSchema },
]);
