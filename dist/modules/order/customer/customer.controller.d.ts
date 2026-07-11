import { Types } from 'mongoose';
import { type UserDocument } from "../../../models";
import { CheckoutDto } from '../dto/checkout.dto';
import { ListOrdersQueryDto } from '../dto/list-orders-query.dto';
import { CustomerService } from './customer.service';
import { type Request } from 'express';
export declare class CustomerController {
    private readonly customerService;
    constructor(customerService: CustomerService);
    checkout(user: UserDocument, dto: CheckoutDto): Promise<{
        message: string;
        payload: {
            order: import("mongoose").Document<unknown, {}, import("../../../common/types").IOrder, {}, import("mongoose").DefaultSchemaOptions> & import("../../../common/types").IOrder & Required<{
                _id: Types.ObjectId;
            }> & {
                __v: number;
            } & {
                id: string;
            };
            payment: {
                transactionRef: string;
                amount: number;
            };
            session?: undefined;
        } | {
            order: import("mongoose").Document<unknown, {}, import("../../../common/types").IOrder, {}, import("mongoose").DefaultSchemaOptions> & import("../../../common/types").IOrder & Required<{
                _id: Types.ObjectId;
            }> & {
                __v: number;
            } & {
                id: string;
            };
            session: {
                id: string;
                url: string | null;
            };
            payment?: undefined;
        };
    }>;
    listOrders(user: UserDocument, query: ListOrdersQueryDto): Promise<{
        message: string;
        payload: {
            docs: (import("mongoose").Document<unknown, {}, import("../../../common/types").IOrder, {}, import("mongoose").DefaultSchemaOptions> & import("../../../common/types").IOrder & Required<{
                _id: Types.ObjectId;
            }> & {
                __v: number;
            } & {
                id: string;
            })[] | null;
            meta: {
                count?: number | undefined;
                page?: string | number | undefined;
                size?: string | number | undefined;
                pages?: number | undefined;
            };
        };
    }>;
    getOrder(user: UserDocument, id: Types.ObjectId): Promise<{
        message: string;
        payload: import("mongoose").FlattenMaps<import("../../../common/types").IOrder>;
    }>;
    cancelOrder(user: UserDocument, id: Types.ObjectId): Promise<{
        message: string;
        payload: import("mongoose").FlattenMaps<import("../../../common/types").IOrder> | null;
    }>;
    orderWebhook(req: Request): Promise<void>;
}
