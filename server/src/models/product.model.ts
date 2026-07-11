import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import type { IProduct } from 'src/common/types';

export type ProductDocument = HydratedDocument<IProduct>;

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
  strict: true,
  strictQuery: true,
})
export class Product implements IProduct {
  @Prop({
    type: String,
    required: true,
    trim: true,
    minLength: 2,
    maxLength: 128,
  })
  name!: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true,
    trim: true,
  })
  slug!: string;

  @Prop({ type: String, default: null, trim: true, maxLength: 2048 })
  description!: string | null;

  @Prop({ type: Number, required: true, min: 0 })
  price!: number;

  @Prop({ type: Number, required: true, min: 0, max: 100, default: 0 })
  discountPercent!: number;

  @Prop({ type: Number, required: true, min: 0, default: 0 })
  stock!: number;

  @Prop({
    type: Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true,
  })
  categoryId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Brand', required: true, index: true })
  brandId!: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  images!: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.virtual('salePrice').get(function (this: ProductDocument) {
  return Math.round(this.price * (1 - this.discountPercent / 100) * 100) / 100;
});

export const ProductModel = MongooseModule.forFeature([
  { name: Product.name, schema: ProductSchema },
]);
