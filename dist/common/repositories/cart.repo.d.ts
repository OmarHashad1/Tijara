import { ICart } from '../types';
import { DatabaseRepo } from './db.repo';
import { Model } from 'mongoose';
export declare class CartRepo extends DatabaseRepo<ICart> {
    protected readonly model: Model<ICart>;
    constructor(model: Model<ICart>);
}
