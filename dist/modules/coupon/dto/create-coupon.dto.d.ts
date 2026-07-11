import { DISCOUNT_TYPE } from "../../../common/enums";
export declare class CreateCouponDto {
    code: string;
    discountType: DISCOUNT_TYPE;
    discountValue: number;
    expiresAt: string;
    usageLimit: number;
}
