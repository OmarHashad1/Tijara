import { InjectModel } from '@nestjs/mongoose';
import { IPayment } from "../types";
import { DatabaseRepo } from "./db.repo";
import { Payment } from 'src/models';
import { Model } from 'mongoose';

export class PaymentRepo extends DatabaseRepo<IPayment>{
    constructor(@InjectModel(Payment.name)protected readonly model:Model<IPayment>){
        super(model)
    }
}