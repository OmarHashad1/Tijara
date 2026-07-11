import { IProduct } from '../types';
import { DatabaseRepo } from './db.repo';
import { Model } from 'mongoose';
export declare class ProductRepo extends DatabaseRepo<IProduct> {
    protected readonly model: Model<IProduct>;
    constructor(model: Model<IProduct>);
}
