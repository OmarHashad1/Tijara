import { ValidateCouponDto } from '../dto/validate-coupon.dto';
import { CustomerService } from './customer.service';
export declare class CustomerController {
    private readonly customerService;
    constructor(customerService: CustomerService);
    validateCoupon(dto: ValidateCouponDto): Promise<{
        message: string;
        payload: import("mongoose").FlattenMaps<import("../../../common/types").ICoupon>;
    }>;
}
