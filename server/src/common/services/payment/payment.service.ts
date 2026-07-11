import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { type Request } from 'express';
import Stripe, {
  Checkout,
  CouponCreateParams,
  RefundCreateParams,
} from 'stripe';
@Injectable()
export class PaymentService {
  private readonly stripe: Stripe;
  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.get('STRIPE_SECRET_KEY') as string,
    );
  }

  async createCheckoutSession(opts: Checkout.SessionCreateParams) {
    return await this.stripe.checkout.sessions.create(opts);
  }

  async createCoupon(opts: CouponCreateParams) {
    return this.stripe.coupons.create(opts);
  }

  webhook(req: Request) {
    return this.stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'] as string,
      this.configService.get('STRIPE_HOOK_SECRET') as string,
    );
  }

  async refundPayment(intentId: string) {
    const intent = await this.stripe.paymentIntents.retrieve(intentId);
    if (!intent) throw new NotFoundException('Intent not found');
    if (intent.status != 'succeeded') {
      throw new BadRequestException(
        'Order refund can only be applied on succeeded payments',
      );
    }
    return this.stripe.refunds.create({ payment_intent: intentId });
  }
}
