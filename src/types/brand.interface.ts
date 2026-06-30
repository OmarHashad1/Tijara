import { Types } from 'mongoose';

export interface IBrand {
  categoryId: Types.ObjectId;
  name: string;
  slug: string;
  logoUrl?: string | null;
  description?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
