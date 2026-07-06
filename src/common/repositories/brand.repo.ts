import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IBrand } from '../types';
import { DatabaseRepo } from './db.repo';
import { Brand } from 'src/models';
import { Model } from 'mongoose';

@Injectable()
export class BrandRepo extends DatabaseRepo<IBrand> {
  constructor(
    @InjectModel(Brand.name) protected readonly model: Model<IBrand>,
  ) {
    super(model);
  }
}
