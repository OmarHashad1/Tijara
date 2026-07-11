import { Types } from 'mongoose';
import { CATEGORY_STATUS } from "../enums";
export interface ICategory {
    _id?: Types.ObjectId;
    name: string;
    slug: string;
    status: CATEGORY_STATUS;
    createdAt?: Date;
    updatedAt?: Date;
}
