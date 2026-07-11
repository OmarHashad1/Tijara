import { ConfigService } from '@nestjs/config';
import { type Request } from 'express';
import { Checkout, CouponCreateParams } from 'stripe';
export declare class PaymentService {
    private readonly configService;
    private readonly stripe;
    constructor(configService: ConfigService);
    createCheckoutSession(opts: Checkout.SessionCreateParams): Promise<import("stripe/cjs/lib").Response<Checkout.Session>>;
    createCoupon(opts: CouponCreateParams): Promise<import("stripe/cjs/lib").Response<import("stripe/cjs/resources/Coupons").Coupon>>;
    webhook(req: Request): import("stripe/cjs/resources/Events").Event;
    refundPayment(intentId: string): Promise<import("stripe/cjs/lib").Response<import("stripe/cjs/resources/Refunds").Refund>>;
}
