import { IOrder } from '../types';
import { DatabaseRepo } from './db.repo';
import { Model } from 'mongoose';
export declare class OrderRepo extends DatabaseRepo<IOrder> {
    protected readonly model: Model<IOrder>;
    constructor(model: Model<IOrder>);
}
