import { Category } from 'src/models';
import { ICategory } from '../types';
import { DatabaseRepo } from './db.repo';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class CategoryRepo extends DatabaseRepo<ICategory> {
  constructor(
    @InjectModel(Category.name)
    protected readonly model: Model<ICategory>,
  ) {
    super(model);
  }
}
