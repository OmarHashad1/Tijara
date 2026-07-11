import { IPayment } from "../types";
import { DatabaseRepo } from "./db.repo";
import { Model } from 'mongoose';
export declare class PaymentRepo extends DatabaseRepo<IPayment> {
    protected readonly model: Model<IPayment>;
    constructor(model: Model<IPayment>);
}
