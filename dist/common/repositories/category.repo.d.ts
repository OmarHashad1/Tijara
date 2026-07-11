import { ICategory } from '../types';
import { DatabaseRepo } from './db.repo';
import { Model } from 'mongoose';
export declare class CategoryRepo extends DatabaseRepo<ICategory> {
    protected readonly model: Model<ICategory>;
    constructor(model: Model<ICategory>);
}
