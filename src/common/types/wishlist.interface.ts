import { Types } from 'mongoose';

export interface IWishlist {
  userId: Types.ObjectId;
  productIds: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}
