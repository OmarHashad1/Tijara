import { Types } from 'mongoose';

export interface IProduct {
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  discountPercent: number;
  stock: number;
  categoryId: Types.ObjectId;
  brandId: Types.ObjectId;
  images: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
