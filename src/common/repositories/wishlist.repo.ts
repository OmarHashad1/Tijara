import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IWishlist } from '../types';
import { DatabaseRepo } from './db.repo';
import { Wishlist } from 'src/models';
import { Model } from 'mongoose';

@Injectable()
export class WishlistRepo extends DatabaseRepo<IWishlist> {
  constructor(
    @InjectModel(Wishlist.name) protected readonly model: Model<IWishlist>,
  ) {
    super(model);
  }
}
