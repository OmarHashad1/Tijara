import { Types } from 'mongoose';
import { PAYMENT_PROVIDER, PAYMENT_STATUS } from 'src/common/enums';

export interface IPayment {
  _id?: Types.ObjectId;
  orderId: Types.ObjectId;
  amount: number;
  status: PAYMENT_STATUS;
  provider: PAYMENT_PROVIDER;
  transactionRef: string;
  createdAt?: Date;
  updatedAt?: Date;
}
