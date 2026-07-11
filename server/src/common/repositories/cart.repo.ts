import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ICart } from '../types';
import { DatabaseRepo } from './db.repo';
import { Cart } from 'src/models';
import { Model } from 'mongoose';

@Injectable()
export class CartRepo extends DatabaseRepo<ICart> {
  constructor(
    @InjectModel(Cart.name) protected readonly model: Model<ICart>,
  ) {
    super(model);
  }
}
