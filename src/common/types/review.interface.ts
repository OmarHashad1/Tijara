import { Types } from 'mongoose';

export interface IReview {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  orderId: Types.ObjectId;
  rating: number;
  comment?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
