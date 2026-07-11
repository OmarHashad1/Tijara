import { Types } from 'mongoose';
import { CouponRepo } from "../../../common/repositories/coupon.repo";
import { CreateCouponDto } from '../dto/create-coupon.dto';
import { UpdateCouponDto } from '../dto/update-coupon.dto';
import { ListCouponsQueryDto } from '../dto/list-coupons-query.dto';
export declare class AdminService {
    private readonly couponRepo;
    constructor(couponRepo: CouponRepo);
    listCoupons(query: ListCouponsQueryDto): Promise<{
        docs: (import("mongoose").Document<unknown, {}, import("../../../common/types").ICoupon, {}, import("mongoose").DefaultSchemaOptions> & import("../../../common/types").ICoupon & Required<{
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
    createCoupon(dto: CreateCouponDto): Promise<import("mongoose").Document<unknown, {}, import("../../../common/types").ICoupon, {}, import("mongoose").DefaultSchemaOptions> & import("../../../common/types").ICoupon & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateCoupon(id: Types.ObjectId, dto: UpdateCouponDto): Promise<(import("mongoose").Document<unknown, {}, import("../../../common/types").ICoupon, {}, import("mongoose").DefaultSchemaOptions> & import("../../../common/types").ICoupon & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    deleteCoupon(id: Types.ObjectId): Promise<void>;
}
