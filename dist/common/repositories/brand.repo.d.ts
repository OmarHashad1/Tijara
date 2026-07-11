import { IBrand } from '../types';
import { DatabaseRepo } from './db.repo';
import { Model } from 'mongoose';
export declare class BrandRepo extends DatabaseRepo<IBrand> {
    protected readonly model: Model<IBrand>;
    constructor(model: Model<IBrand>);
}
