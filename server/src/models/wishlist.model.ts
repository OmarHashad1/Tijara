import {
  MongooseModule,
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import type { IWishlist } from 'src/common/types';

export type WishlistDocument = HydratedDocument<IWishlist>;

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
  strict: true,
  strictQuery: true,
})
export class Wishlist implements IWishlist {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  })
  userId!: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Product', default: [] })
  productIds!: Types.ObjectId[];
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);

export const WishlistModel = MongooseModule.forFeature([
  { name: Wishlist.name, schema: WishlistSchema },
]);
