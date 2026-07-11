import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ICoupon } from '../types';
import { DatabaseRepo } from './db.repo';
import { Coupon } from 'src/models';
import { Model } from 'mongoose';

@Injectable()
export class CouponRepo extends DatabaseRepo<ICoupon> {
  constructor(
    @InjectModel(Coupon.name) protected readonly model: Model<ICoupon>,
  ) {
    super(model);
  }
}
