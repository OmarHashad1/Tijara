import { Types } from 'mongoose';
export interface IWishlist {
    _id?: Types.ObjectId;
    userId: Types.ObjectId;
    productIds: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}
