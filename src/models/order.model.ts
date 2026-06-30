import {
  MongooseModule,
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ORDER_STATUS } from 'src/enums';

import type { IOrder, IOrderItem } from 'src/types';

export type OrderDocument = HydratedDocument<IOrder>;

@Schema({ _id: false })
export class OrderItem implements IOrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId!: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true })
  name!: string;

  @Prop({ type: Number, required: true, min: 0 })
  price!: number;

  @Prop({ type: Number, required: true, min: 1 })
  quantity!: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true,
  strict: true,
  strictQuery: true,
})
export class Order implements IOrder {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ type: [OrderItemSchema], required: true })
  items!: IOrderItem[];

  @Prop({ type: String, default: null, trim: true, uppercase: true })
  couponCode!: string | null;

  @Prop({ type: Number, required: true, min: 0 })
  total!: number;

  @Prop({
    type: String,
    enum: [...Object.values(ORDER_STATUS)],
    default: ORDER_STATUS.PENDING,
    index: true,
  })
  status!: ORDER_STATUS;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

export const OrderModel = MongooseModule.forFeature([
  { name: Order.name, schema: OrderSchema },
]);
