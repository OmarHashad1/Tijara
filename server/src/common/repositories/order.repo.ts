import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IOrder } from '../types';
import { DatabaseRepo } from './db.repo';
import { Order } from 'src/models';
import { Model } from 'mongoose';

@Injectable()
export class OrderRepo extends DatabaseRepo<IOrder> {
  constructor(
    @InjectModel(Order.name) protected readonly model: Model<IOrder>,
  ) {
    super(model);
  }
}
