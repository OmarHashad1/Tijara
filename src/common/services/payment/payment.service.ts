import { ConfigService } from '@nestjs/config';
import { Injectable } from "@nestjs/common";
import Stripe, { Checkout, CouponCreateParams } from "stripe"
@Injectable()
export class PaymentService{
    private readonly stripe:Stripe
constructor(private readonly configService:ConfigService){
    console.log(this.configService.get("STRIPE_SECRET_KEY"))
    this.stripe = new Stripe(this.configService.get("STRIPE_SECRET_KEY") as string)
}

async createCheckoutSession(opts:Checkout.SessionCreateParams)
{
    return await this.stripe.checkout.sessions.create(opts)
}

async createCoupon(opts:CouponCreateParams){

    return this.stripe.coupons.create(opts)
}

}

