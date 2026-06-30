import {
  MongooseModule,
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CATEGORY_STATUS } from 'src/enums';

import type { ICategory } from 'src/types';

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
    default: CATEGORY_STATUS.DRAFT,
    index: true,
  })
  status!: CATEGORY_STATUS;
}

export const CategorySchema = SchemaFactory.createForClass(Category);



export const CategoryModel = MongooseModule.forFeature([
  { name: Category.name, schema: CategorySchema },
]);
