import { Types } from 'mongoose';
import { CATEGORY_STATUS } from 'src/common/enums';

export interface ICategory {
  _id?: Types.ObjectId;
  name: string;
  slug: string;
  status: CATEGORY_STATUS;
  createdAt?: Date;
  updatedAt?: Date;
}
