import { S3Service } from "../../../common/services/aws";
import { FlattenMaps, Types } from 'mongoose';
import { CartRepo } from "../../../common/repositories/cart.repo";
import { OrderRepo } from "../../../common/repositories/order.repo";
import { ProductRepo } from "../../../common/repositories/product.repo";
import { IOrder } from "../../../common/types";
import { CheckoutDto } from '../dto/checkout.dto';
import { ListOrdersQueryDto } from '../dto/list-orders-query.dto';
import { PaymentService } from "../../../common/services/payment/payment.service";
import { PaymentRepo } from "../../../common/repositories/payment.repo";
import { ConfigService } from '@nestjs/config';
import { UserDocument } from "../../../models";
import { UserRepo } from "../../../common/repositories";
import { CouponRepo } from "../../../common/repositories/coupon.repo";
import { Request } from 'express';
export declare class CustomerService {
    private readonly orderRepo;
    private readonly cartRepo;
    private readonly productRepo;
    private readonly paymentService;
    private readonly paymentRepo;
    private readonly configService;
    private readonly s3Service;
    private readonly couponRepo;
    private readonly userRepo;
    constructor(orderRepo: OrderRepo, cartRepo: CartRepo, productRepo: ProductRepo, paymentService: PaymentService, paymentRepo: PaymentRepo, configService: ConfigService, s3Service: S3Service, couponRepo: CouponRepo, userRepo: UserRepo);
    checkout(user: UserDocument, dto: CheckoutDto): Promise<{
        order: import("mongoose").Document<unknown, {}, IOrder, {}, import("mongoose").DefaultSchemaOptions> & IOrder & Required<{
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
        order: import("mongoose").Document<unknown, {}, IOrder, {}, import("mongoose").DefaultSchemaOptions> & IOrder & Required<{
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
    }>;
    listOrders(userId: Types.ObjectId, query: ListOrdersQueryDto): Promise<{
        docs: (import("mongoose").Document<unknown, {}, IOrder, {}, import("mongoose").DefaultSchemaOptions> & IOrder & Required<{
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
    }>;
    getOrder(userId: Types.ObjectId, id: Types.ObjectId): Promise<FlattenMaps<IOrder>>;
    cancelOrder(user: UserDocument, id: Types.ObjectId): Promise<FlattenMaps<IOrder> | null>;
    private findOrderOwner;
    webhook(request: Request): Promise<void>;
}
