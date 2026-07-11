import { Types } from 'mongoose';
import { CreateCouponDto } from '../dto/create-coupon.dto';
import { UpdateCouponDto } from '../dto/update-coupon.dto';
import { ListCouponsQueryDto } from '../dto/list-coupons-query.dto';
import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    listCoupons(query: ListCouponsQueryDto): Promise<{
        message: string;
        payload: {
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
        };
    }>;
    createCoupon(dto: CreateCouponDto): Promise<{
        message: string;
        payload: import("mongoose").Document<unknown, {}, import("../../../common/types").ICoupon, {}, import("mongoose").DefaultSchemaOptions> & import("../../../common/types").ICoupon & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    updateCoupon(id: Types.ObjectId, dto: UpdateCouponDto): Promise<{
        message: string;
        payload: (import("mongoose").Document<unknown, {}, import("../../../common/types").ICoupon, {}, import("mongoose").DefaultSchemaOptions> & import("../../../common/types").ICoupon & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    deleteCoupon(id: Types.ObjectId): Promise<{
        message: string;
    }>;
}
