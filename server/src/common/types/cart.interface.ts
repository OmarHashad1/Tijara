import { Types } from 'mongoose';

export interface ICartItem {
  productId: Types.ObjectId;
  quantity: number;
}

export interface ICart {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  items: ICartItem[];
  createdAt?: Date;
  updatedAt?: Date;
}
