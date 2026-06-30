import { Types } from 'mongoose';
import { PAYMENT_PROVIDER, PAYMENT_STATUS } from 'src/enums';

export interface IPayment {
  orderId: Types.ObjectId;
  amount: number;
  status: PAYMENT_STATUS;
  provider: PAYMENT_PROVIDER;
  transactionRef: string;
  createdAt?: Date;
  updatedAt?: Date;
}
