import { Types } from 'mongoose';
import { DISCOUNT_TYPE } from "../enums";
export interface ICoupon {
    _id?: Types.ObjectId;
    code: string;
    discountType: DISCOUNT_TYPE;
    discountValue: number;
    expiresAt: Date;
    usageLimit: number;
    timesUsed: number;
    createdAt?: Date;
    updatedAt?: Date;
}
