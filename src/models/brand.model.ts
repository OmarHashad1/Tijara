import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import type { IBrand } from 'src/common/types';

export type BrandDocument = HydratedDocument<IBrand>;

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
  strict: true,
  strictQuery: true,
})
export class Brand implements IBrand {
  @Prop({ type: [Types.ObjectId], ref: 'Category', default: [], index: true })
  categoryIds!: Types.ObjectId[];

  @Prop({
    type: String,
    required: true,
    trim: true,
    minLength: 2,
    maxLength: 64,
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

  @Prop({ type: String, default: null, trim: true })
  logoUrl!: string | null;

  @Prop({ type: String, default: null, trim: true, maxLength: 1024 })
  description!: string | null;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);

export const BrandModel = MongooseModule.forFeature([
  { name: Brand.name, schema: BrandSchema },
]);
