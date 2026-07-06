import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IProduct } from '../types';
import { DatabaseRepo } from './db.repo';
import { Product } from 'src/models';
import { Model } from 'mongoose';

@Injectable()
export class ProductRepo extends DatabaseRepo<IProduct> {
  constructor(
    @InjectModel(Product.name) protected readonly model: Model<IProduct>,
  ) {
    super(model);
  }
}
