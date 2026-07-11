import { IReview } from '../types';
import { DatabaseRepo } from './db.repo';
import { Model } from 'mongoose';
export declare class ReviewRepo extends DatabaseRepo<IReview> {
    protected readonly model: Model<IReview>;
    constructor(model: Model<IReview>);
}
