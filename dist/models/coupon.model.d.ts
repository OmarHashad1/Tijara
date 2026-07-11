import { HydratedDocument } from 'mongoose';
import { DISCOUNT_TYPE } from "../common/enums";
import type { ICoupon } from "../common/types";
export type CouponDocument = HydratedDocument<ICoupon>;
export declare class Coupon implements ICoupon {
    code: string;
    discountType: DISCOUNT_TYPE;
    discountValue: number;
    expiresAt: Date;
    usageLimit: number;
    timesUsed: number;
}
export declare const CouponSchema: import("mongoose").Schema<Coupon, import("mongoose").Model<Coupon, any, any, any, any, any, Coupon>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Coupon, import("mongoose").Document<unknown, {}, Coupon, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Coupon & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    code?: import("mongoose").SchemaDefinitionProperty<string, Coupon, import("mongoose").Document<unknown, {}, Coupon, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Coupon & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    discountType?: import("mongoose").SchemaDefinitionProperty<DISCOUNT_TYPE, Coupon, import("mongoose").Document<unknown, {}, Coupon, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Coupon & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    discountValue?: import("mongoose").SchemaDefinitionProperty<number, Coupon, import("mongoose").Document<unknown, {}, Coupon, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Coupon & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    expiresAt?: import("mongoose").SchemaDefinitionProperty<Date, Coupon, import("mongoose").Document<unknown, {}, Coupon, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Coupon & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    usageLimit?: import("mongoose").SchemaDefinitionProperty<number, Coupon, import("mongoose").Document<unknown, {}, Coupon, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Coupon & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    timesUsed?: import("mongoose").SchemaDefinitionProperty<number, Coupon, import("mongoose").Document<unknown, {}, Coupon, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Coupon & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Coupon>;
export declare const CouponModel: import("@nestjs/common").DynamicModule;
