import { Types } from 'mongoose';
import { ORDER_STATUS } from 'src/common/enums';

export interface IOrderItem {
  productId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  items: IOrderItem[];
  couponCode?: string | null;
  total: number;
  status: ORDER_STATUS;
  createdAt?: Date;
  updatedAt?: Date;
}
