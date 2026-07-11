import { Types } from 'mongoose';
import { ORDER_STATUS, PAYMENT_PROVIDER } from 'src/common/enums';

export interface IOrderItem {
  productId: Types.ObjectId;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface IOrder {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  items: IOrderItem[];
  couponCode?: string | null;
  total: number;
  intentId?: string;
  paymentMethod: PAYMENT_PROVIDER;
  paidAt?: Date | null;
  refundedAt?: Date | null;
  status: ORDER_STATUS;
  createdAt?: Date;
  updatedAt?: Date;
}
