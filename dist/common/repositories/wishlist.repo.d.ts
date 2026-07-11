import { IWishlist } from '../types';
import { DatabaseRepo } from './db.repo';
import { Model } from 'mongoose';
export declare class WishlistRepo extends DatabaseRepo<IWishlist> {
    protected readonly model: Model<IWishlist>;
    constructor(model: Model<IWishlist>);
}
