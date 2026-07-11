import { ICoupon } from '../types';
import { DatabaseRepo } from './db.repo';
import { Model } from 'mongoose';
export declare class CouponRepo extends DatabaseRepo<ICoupon> {
    protected readonly model: Model<ICoupon>;
    constructor(model: Model<ICoupon>);
}
