import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CATEGORY_STATUS } from 'src/common/enums';

import type { ICategory } from 'src/common/types';
import { createSlug } from 'src/common/utils/slugify.util';

export type CategoryDocument = HydratedDocument<ICategory>;

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
  strict: true,
  strictQuery: true,
})
export class Category implements ICategory {
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

  @Prop({
    type: String,
    enum: [...Object.values(CATEGORY_STATUS)],
    default: CATEGORY_STATUS.PUBLISHED,
    index: true,
  })
  status!: CATEGORY_STATUS;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

export const CategoryModel = MongooseModule.forFeatureAsync([
  {
    name: Category.name,
    useFactory: () => {
      const schema = CategorySchema;

      return schema;
    },
  },
]);
