import { S3Service } from 'src/common/services/aws';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FlattenMaps, HydratedDocument, Types } from 'mongoose';
import { CartRepo } from 'src/common/repositories/cart.repo';
import { OrderRepo } from 'src/common/repositories/order.repo';
import { ProductRepo } from 'src/common/repositories/product.repo';
import {
  DISCOUNT_TYPE,
  ORDER_STATUS,
  ORDER_STATUS_TRANSITIONS,
  PAYMENT_PROVIDER,
  PAYMENT_STATUS,
} from 'src/common/enums';
import { EMAIL_EVENTS } from 'src/common/enums/email.enums';
import { emailEmitter } from 'src/common/events/email.event';
import { ICoupon, IOrder, IOrderItem, IProduct } from 'src/common/types';
import { CheckoutDto } from '../dto/checkout.dto';
import { ListOrdersQueryDto } from '../dto/list-orders-query.dto';
import { PaymentService } from 'src/common/services/payment/payment.service';
import { PaymentRepo } from 'src/common/repositories/payment.repo';
import { ConfigService } from '@nestjs/config';
import { UserDocument } from 'src/models';
import { UserRepo } from 'src/common/repositories';
import { CouponRepo } from 'src/common/repositories/coupon.repo';
import { Checkout, Coupon, PaymentIntent, Response } from 'stripe';
import { Request } from 'express';

@Injectable()
export class CustomerService {
  constructor(
    private readonly orderRepo: OrderRepo,
    private readonly cartRepo: CartRepo,
    private readonly productRepo: ProductRepo,
    private readonly paymentService: PaymentService,
    private readonly paymentRepo: PaymentRepo,
    private readonly configService: ConfigService,
    private readonly s3Service: S3Service,
    private readonly couponRepo: CouponRepo,
    private readonly userRepo: UserRepo,
  ) {}

  async checkout(user: UserDocument, dto: CheckoutDto) {
    const existingPending = await this.orderRepo.findOne({
      filter: { userId: user._id, status: ORDER_STATUS.PENDING },
      options: { lean: true },
    });
    if (existingPending) {
      await this.orderRepo.updateOne({
        filter: { _id: existingPending._id, status: ORDER_STATUS.PENDING },
        update: { $set: { status: ORDER_STATUS.CANCELLED } },
      });
      await Promise.all(
        existingPending.items.map((item) =>
          this.productRepo.updateOne({
            filter: { _id: item.productId },
            update: { $inc: { stock: item.quantity } },
          }),
        ),
      );
    }

    const shippingAddress = user.addresses?.find(
      (address) => address._id?.toString() === dto.addressId,
    );
    if (!shippingAddress)
      throw new NotFoundException(
        'Shipping address not found — add one to your profile first',
      );

    const cart = await this.cartRepo.findOne({
      filter: { userId: user._id },
      options: { lean: true, populate: { path: 'items.productId' } },
    });
    if (!cart || !cart.items.length)
      throw new BadRequestException('Cart is empty');

    const reserved: { productId: Types.ObjectId; quantity: number }[] = [];
    const orderItems: IOrderItem[] = [];
    let total = 0;

    try {
      for (const item of cart.items) {
        const product = await this.productRepo.findOne({
          filter: { _id: item.productId },
          options: { lean: true },
        });
        if (!product) throw new NotFoundException('Product not found');

        const result = await this.productRepo.updateOne({
          filter: { _id: item.productId, stock: { $gte: item.quantity } },
          update: { $inc: { stock: -item.quantity } },
        });
        if (!result.matchedCount)
          throw new UnprocessableEntityException(
            `Insufficient stock for product "${product.name}"`,
          );
        reserved.push({ productId: item.productId, quantity: item.quantity });

        const unitPrice = product.discountPercent
          ? Math.round(
              product.price * (1 - product.discountPercent / 100) * 100,
            ) / 100
          : product.price;
        orderItems.push({
          productId: item.productId,
          name: product.name,
          image: product.images[0],
          price: unitPrice,
          quantity: item.quantity,
        });
        total += unitPrice * item.quantity;
      }
    } catch (err) {
      await Promise.all(
        reserved.map((item) =>
          this.productRepo.updateOne({
            filter: { _id: item.productId },
            update: { $inc: { stock: item.quantity } },
          }),
        ),
      );
      throw err;
    }
    let coupon: null | FlattenMaps<ICoupon> = null;
    let stripeCoupon: null | Response<Coupon> = null;
    if (dto.couponCode) {
      coupon = await this.couponRepo.findOne({
        filter: {
          code: dto.couponCode,
        },
      });
      if (!coupon) throw new NotFoundException('Coupon not found');
      if (coupon.expiresAt <= new Date(Date.now()))
        throw new BadRequestException('Coupon has expired');
      if (coupon.timesUsed >= coupon.usageLimit)
        throw new BadRequestException('Coupon usage limit reached');
      if (coupon.discountType === DISCOUNT_TYPE.PERCENT)
        total = total - total * (coupon.discountValue / 100);
      else if (coupon.discountType === DISCOUNT_TYPE.FIXED)
        total = Math.max(0, total - coupon.discountValue);

      stripeCoupon = await this.paymentService.createCoupon({
        duration: 'once',
        ...(coupon.discountType === DISCOUNT_TYPE.PERCENT
          ? { percent_off: coupon.discountValue }
          : {
              amount_off: Math.round(coupon.discountValue * 100),
              currency: 'egp',
            }),
      });
    }
    const paymentMethod = dto.provider ?? PAYMENT_PROVIDER.STRIPE;
    const order = await this.orderRepo.create({
      data: {
        userId: user._id,
        items: orderItems,
        couponCode: dto.couponCode ?? null,
        shippingAddress: {
          city: shippingAddress.city,
          country: shippingAddress.country,
        },
        total: Math.round(total * 100) / 100,
        paymentMethod,
        status: ORDER_STATUS.PENDING,
      },
    });

    if (dto.provider === PAYMENT_PROVIDER.CASH_ON_DELIVERY) {
      const payment = await this.paymentRepo.create({
        data: {
          orderId: order._id,
          amount: total,
          provider: dto.provider,
          transactionRef: `COD-${order._id}-${Date.now()}`,
        },
      });
      order.status = ORDER_STATUS.CONFIRMED;
      order.paidAt = new Date();
      await order.save();
      await this.cartRepo.deleteOne({
        filter: { userId: user._id },
      });

      emailEmitter.emit(EMAIL_EVENTS.ORDER_CONFIRMED, {
        to: user.email,
        firstName: user.firstName,
        orderId: order._id.toString(),
        total: order.total,
      });

      return {
        order,
        payment: {
          transactionRef: payment.transactionRef,
          amount: payment.amount,
        },
      };
    }
    const lineItems = await Promise.all(
      orderItems.map(async (item) => ({
        quantity: item.quantity,
        price_data: {
          currency: 'EGP',
          unit_amount: Math.round(item.price * 100),
          product_data: {
            name: item.name,
            images: [await this.s3Service.getAsset({ Key: item.image })],
          },
        },
      })),
    );

    const session = await this.paymentService.createCheckoutSession({
      mode: 'payment',
      metadata: { orderId: order._id.toString() },
      payment_intent_data: { metadata: { orderId: order._id.toString() } },
      expires_at: Math.floor(Date.now() / 1000) + 31 * 60,
      success_url: `${this.configService.get('CLIENT_URL') as string}/order/success`,
      cancel_url: `${this.configService.get('CLIENT_URL') as string}/order/fail`,
      customer_email: user.email,
      discounts: stripeCoupon ? [{ coupon: stripeCoupon.id }] : [],
      line_items: lineItems,
    });

    await this.paymentRepo.create({
      data: {
        orderId: order._id,
        amount: Math.round(total * 100) / 100,
        provider: PAYMENT_PROVIDER.STRIPE,
        transactionRef: session.id,
      },
    });

    return {
      order,
      session: { id: session.id, url: session.url },
    };
  }

  async listOrders(userId: Types.ObjectId, query: ListOrdersQueryDto) {
    const { status, page = 1, size = 20 } = query;
    const filter: Record<string, unknown> = { userId };
    if (status) filter.status = status;

    return this.orderRepo.paginate({ filter, options: {}, page, size });
  }

  async getOrder(userId: Types.ObjectId, id: Types.ObjectId) {
    const order = await this.orderRepo.findOne({
      filter: { _id: id, userId },
      options: { lean: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async cancelOrder(user: UserDocument, id: Types.ObjectId) {
    const order = await this.orderRepo.findOne({
      filter: { _id: id, userId: user._id },
      options: { lean: true },
    });
    if (!order) throw new NotFoundException('Order not found');

    if (
      !ORDER_STATUS_TRANSITIONS[order.status].includes(ORDER_STATUS.CANCELLED)
    )
      throw new BadRequestException(
        'Only pending or confirmed order can be cancelled',
      );

    const claim = await this.orderRepo.updateOne({
      filter: { _id: id, userId: user._id, status: order.status },
      update: { $set: { status: ORDER_STATUS.CANCELLED } },
    });
    if (!claim.matchedCount)
      throw new BadRequestException(
        'Order status has changed, please try again',
      );

    if (order.paymentMethod === PAYMENT_PROVIDER.CASH_ON_DELIVERY) {
      await this.paymentRepo.findOneAndUpdate({
        filter: { orderId: order._id },
        update: { $set: { status: PAYMENT_STATUS.CANCELLED } },
      });
      emailEmitter.emit(EMAIL_EVENTS.ORDER_CANCELLED, {
        to: user.email,
        firstName: user.firstName,
        orderId: id.toString(),
      });
    } else if (
      order.paymentMethod === PAYMENT_PROVIDER.STRIPE &&
      order.paidAt &&
      order.status === ORDER_STATUS.CONFIRMED
    ) {
      await this.paymentService.refundPayment(order.intentId as string);
      await this.orderRepo.updateOne({
        filter: { _id: id },
        update: { $set: { refundedAt: new Date() } },
      });
      await this.paymentRepo.findOneAndUpdate({
        filter: { orderId: order._id },
        update: { $set: { status: PAYMENT_STATUS.REFUNDED } },
      });
      emailEmitter.emit(EMAIL_EVENTS.ORDER_REFUNDED, {
        to: user.email,
        firstName: user.firstName,
        orderId: id.toString(),
        amount: order.total,
      });
    } else {
      await this.paymentRepo.findOneAndUpdate({
        filter: { orderId: order._id },
        update: { $set: { status: PAYMENT_STATUS.CANCELLED } },
      });
      emailEmitter.emit(EMAIL_EVENTS.ORDER_CANCELLED, {
        to: user.email,
        firstName: user.firstName,
        orderId: id.toString(),
      });
    }

    await Promise.all(
      order.items.map((item) =>
        this.productRepo.updateOne({
          filter: { _id: item.productId },
          update: { $inc: { stock: item.quantity } },
        }),
      ),
    );

    return this.orderRepo.findOne({
      filter: { _id: id },
      options: { lean: true },
    });
  }

  private async findOrderOwner(userId: Types.ObjectId) {
    return this.userRepo.findOne({
      filter: { _id: userId },
      options: { lean: true },
    });
  }

  async webhook(request: Request) {
    const event = this.paymentService.webhook(request);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Checkout.Session;
        const { orderId } = (session.metadata ?? {}) as { orderId?: string };
        if (!orderId) return;

        const intentId =
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent?.id;

        const result = await this.orderRepo.updateOne({
          filter: { _id: orderId, status: ORDER_STATUS.PENDING },
          update: {
            $set: {
              status: ORDER_STATUS.CONFIRMED,
              intentId,
              paidAt: new Date(),
            },
          },
        });
        if (!result.matchedCount) return;

        const order = await this.orderRepo.findOne({
          filter: { _id: orderId },
          options: { lean: true },
        });
        if (!order) return;

        await this.paymentRepo.updateOne({
          filter: { orderId },
          update: { $set: { status: PAYMENT_STATUS.COMPLETED } },
        });

        if (order.couponCode) {
          await this.couponRepo.updateOne({
            filter: { code: order.couponCode },
            update: { $inc: { timesUsed: 1 } },
          });
        }

        await this.cartRepo.deleteOne({
          filter: { userId: order.userId },
        });

        const owner = await this.findOrderOwner(order.userId);
        if (owner) {
          emailEmitter.emit(EMAIL_EVENTS.ORDER_CONFIRMED, {
            to: owner.email,
            firstName: owner.firstName,
            orderId,
            total: order.total,
          });
        }

        return;
      }
      case 'payment_intent.payment_failed':
      case 'payment_intent.canceled': {
        const intent = event.data.object as PaymentIntent;
        const { orderId } = (intent.metadata ?? {}) as { orderId?: string };
        if (!orderId) return;

        const result = await this.orderRepo.updateOne({
          filter: { _id: orderId, status: ORDER_STATUS.PENDING },
          update: {
            $set: { status: ORDER_STATUS.CANCELLED, intentId: intent.id },
          },
        });
        if (!result.matchedCount) return;

        const order = await this.orderRepo.findOne({
          filter: { _id: orderId },
          options: { lean: true },
        });
        if (!order) return;

        await this.paymentRepo.updateOne({
          filter: { orderId },
          update: { $set: { status: PAYMENT_STATUS.FAILED } },
        });
        await Promise.all(
          order.items.map((item) =>
            this.productRepo.updateOne({
              filter: { _id: item.productId },
              update: { $inc: { stock: item.quantity } },
            }),
          ),
        );

        const owner = await this.findOrderOwner(order.userId);
        if (owner) {
          emailEmitter.emit(EMAIL_EVENTS.ORDER_CANCELLED, {
            to: owner.email,
            firstName: owner.firstName,
            orderId,
          });
        }

        return;
      }
      case 'checkout.session.expired': {
        const session = event.data.object as Checkout.Session;
        const { orderId } = (session.metadata ?? {}) as { orderId?: string };
        if (!orderId) return;

        const result = await this.orderRepo.updateOne({
          filter: { _id: orderId, status: ORDER_STATUS.PENDING },
          update: { $set: { status: ORDER_STATUS.CANCELLED } },
        });
        if (!result.matchedCount) return;

        const order = await this.orderRepo.findOne({
          filter: { _id: orderId },
          options: { lean: true },
        });
        if (!order) return;

        await this.paymentRepo.updateOne({
          filter: { orderId },
          update: { $set: { status: PAYMENT_STATUS.FAILED } },
        });
        await Promise.all(
          order.items.map((item) =>
            this.productRepo.updateOne({
              filter: { _id: item.productId },
              update: { $inc: { stock: item.quantity } },
            }),
          ),
        );

        const owner = await this.findOrderOwner(order.userId);
        if (owner) {
          emailEmitter.emit(EMAIL_EVENTS.ORDER_CANCELLED, {
            to: owner.email,
            firstName: owner.firstName,
            orderId,
          });
        }

        return;
      }
      default:
        return;
    }
  }
}
