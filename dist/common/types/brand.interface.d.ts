import { Types } from 'mongoose';
export interface IBrand {
    _id?: Types.ObjectId;
    categoryIds: Types.ObjectId[];
    name: string;
    slug: string;
    logo?: string | null;
    description?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}
