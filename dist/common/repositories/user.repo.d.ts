import { IUser } from "../types";
import { DatabaseRepo } from './db.repo';
import { Model } from 'mongoose';
export declare class UserRepo extends DatabaseRepo<IUser> {
    protected readonly model: Model<IUser>;
    constructor(model: Model<IUser>);
}
