import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IReview } from '../types';
import { DatabaseRepo } from './db.repo';
import { Review } from 'src/models';
import { Model } from 'mongoose';

@Injectable()
export class ReviewRepo extends DatabaseRepo<IReview> {
  constructor(
    @InjectModel(Review.name) protected readonly model: Model<IReview>,
  ) {
    super(model);
  }
}
