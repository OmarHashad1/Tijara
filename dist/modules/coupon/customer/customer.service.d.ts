import { CouponRepo } from "../../../common/repositories/coupon.repo";
import { ValidateCouponDto } from '../dto/validate-coupon.dto';
export declare class CustomerService {
    private readonly couponRepo;
    constructor(couponRepo: CouponRepo);
    validateCoupon(dto: ValidateCouponDto): Promise<import("mongoose").FlattenMaps<import("../../../common/types").ICoupon>>;
}
