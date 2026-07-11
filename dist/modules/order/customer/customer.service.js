"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const aws_1 = require("../../../common/services/aws");
const common_1 = require("@nestjs/common");
const cart_repo_1 = require("../../../common/repositories/cart.repo");
const order_repo_1 = require("../../../common/repositories/order.repo");
const product_repo_1 = require("../../../common/repositories/product.repo");
const enums_1 = require("../../../common/enums");
const email_enums_1 = require("../../../common/enums/email.enums");
const email_event_1 = require("../../../common/events/email.event");
const payment_service_1 = require("../../../common/services/payment/payment.service");
const payment_repo_1 = require("../../../common/repositories/payment.repo");
const config_1 = require("@nestjs/config");
const repositories_1 = require("../../../common/repositories");
const coupon_repo_1 = require("../../../common/repositories/coupon.repo");
let CustomerService = class CustomerService {
    orderRepo;
    cartRepo;
    productRepo;
    paymentService;
    paymentRepo;
    configService;
    s3Service;
    couponRepo;
    userRepo;
    constructor(orderRepo, cartRepo, productRepo, paymentService, paymentRepo, configService, s3Service, couponRepo, userRepo) {
        this.orderRepo = orderRepo;
        this.cartRepo = cartRepo;
        this.productRepo = productRepo;
        this.paymentService = paymentService;
        this.paymentRepo = paymentRepo;
        this.configService = configService;
        this.s3Service = s3Service;
        this.couponRepo = couponRepo;
        this.userRepo = userRepo;
    }
    async checkout(user, dto) {
        const existingPending = await this.orderRepo.findOne({
            filter: { userId: user._id, status: enums_1.ORDER_STATUS.PENDING },
            options: { lean: true },
        });
        if (existingPending) {
            await this.orderRepo.updateOne({
                filter: { _id: existingPending._id, status: enums_1.ORDER_STATUS.PENDING },
                update: { $set: { status: enums_1.ORDER_STATUS.CANCELLED } },
            });
            await Promise.all(existingPending.items.map((item) => this.productRepo.updateOne({
                filter: { _id: item.productId },
                update: { $inc: { stock: item.quantity } },
            })));
        }
        const cart = await this.cartRepo.findOne({
            filter: { userId: user._id },
            options: { lean: true, populate: { path: 'items.productId' } },
        });
        if (!cart || !cart.items.length)
            throw new common_1.BadRequestException('Cart is empty');
        const reserved = [];
        const orderItems = [];
        let total = 0;
        try {
            for (const item of cart.items) {
                const product = await this.productRepo.findOne({
                    filter: { _id: item.productId },
                    options: { lean: true },
                });
                if (!product)
                    throw new common_1.NotFoundException('Product not found');
                const result = await this.productRepo.updateOne({
                    filter: { _id: item.productId, stock: { $gte: item.quantity } },
                    update: { $inc: { stock: -item.quantity } },
                });
                if (!result.matchedCount)
                    throw new common_1.UnprocessableEntityException(`Insufficient stock for product "${product.name}"`);
                reserved.push({ productId: item.productId, quantity: item.quantity });
                const unitPrice = product.discountPercent
                    ? Math.round(product.price * (1 - product.discountPercent / 100) * 100) / 100
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
        }
        catch (err) {
            await Promise.all(reserved.map((item) => this.productRepo.updateOne({
                filter: { _id: item.productId },
                update: { $inc: { stock: item.quantity } },
            })));
            throw err;
        }
        let coupon = null;
        let stripeCoupon = null;
        if (dto.couponCode) {
            coupon = await this.couponRepo.findOne({
                filter: {
                    code: dto.couponCode,
                },
            });
            if (!coupon)
                throw new common_1.NotFoundException('Coupon not found');
            if (coupon.expiresAt <= new Date(Date.now()))
                throw new common_1.BadRequestException('Coupon has expired');
            if (coupon.timesUsed >= coupon.usageLimit)
                throw new common_1.BadRequestException('Coupon usage limit reached');
            if (coupon.discountType === enums_1.DISCOUNT_TYPE.PERCENT)
                total = total - total * (coupon.discountValue / 100);
            else if (coupon.discountType === enums_1.DISCOUNT_TYPE.FIXED)
                total = Math.max(0, total - coupon.discountValue);
            stripeCoupon = await this.paymentService.createCoupon({
                duration: 'once',
                ...(coupon.discountType === enums_1.DISCOUNT_TYPE.PERCENT
                    ? { percent_off: coupon.discountValue }
                    : {
                        amount_off: Math.round(coupon.discountValue * 100),
                        currency: 'egp',
                    }),
            });
        }
        const paymentMethod = dto.provider ?? enums_1.PAYMENT_PROVIDER.STRIPE;
        const order = await this.orderRepo.create({
            data: {
                userId: user._id,
                items: orderItems,
                couponCode: dto.couponCode ?? null,
                total: Math.round(total * 100) / 100,
                paymentMethod,
                status: enums_1.ORDER_STATUS.PENDING,
            },
        });
        if (dto.provider === enums_1.PAYMENT_PROVIDER.CASH_ON_DELIVERY) {
            const payment = await this.paymentRepo.create({
                data: {
                    orderId: order._id,
                    amount: total,
                    provider: dto.provider,
                    transactionRef: `COD-${order._id}-${Date.now()}`,
                },
            });
            order.status = enums_1.ORDER_STATUS.CONFIRMED;
            order.paidAt = new Date();
            await order.save();
            await this.cartRepo.deleteOne({
                filter: { userId: user._id },
            });
            email_event_1.emailEmitter.emit(email_enums_1.EMAIL_EVENTS.ORDER_CONFIRMED, {
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
        const lineItems = await Promise.all(orderItems.map(async (item) => ({
            quantity: item.quantity,
            price_data: {
                currency: 'EGP',
                unit_amount: Math.round(item.price * 100),
                product_data: {
                    name: item.name,
                    images: [await this.s3Service.getAsset({ Key: item.image })],
                },
            },
        })));
        const session = await this.paymentService.createCheckoutSession({
            mode: 'payment',
            metadata: { orderId: order._id.toString() },
            payment_intent_data: { metadata: { orderId: order._id.toString() } },
            expires_at: Math.floor(Date.now() / 1000) + 31 * 60,
            success_url: `${this.configService.get('CLIENT_URL')}/order/success`,
            cancel_url: `${this.configService.get('CLIENT_URL')}/order/fail`,
            customer_email: user.email,
            discounts: stripeCoupon ? [{ coupon: stripeCoupon.id }] : [],
            line_items: lineItems,
        });
        await this.paymentRepo.create({
            data: {
                orderId: order._id,
                amount: Math.round(total * 100) / 100,
                provider: enums_1.PAYMENT_PROVIDER.STRIPE,
                transactionRef: session.id,
            },
        });
        return {
            order,
            session: { id: session.id, url: session.url },
        };
    }
    async listOrders(userId, query) {
        const { status, page = 1, size = 20 } = query;
        const filter = { userId };
        if (status)
            filter.status = status;
        return this.orderRepo.paginate({ filter, options: {}, page, size });
    }
    async getOrder(userId, id) {
        const order = await this.orderRepo.findOne({
            filter: { _id: id, userId },
            options: { lean: true },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    async cancelOrder(user, id) {
        const order = await this.orderRepo.findOne({
            filter: { _id: id, userId: user._id },
            options: { lean: true },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (!enums_1.ORDER_STATUS_TRANSITIONS[order.status].includes(enums_1.ORDER_STATUS.CANCELLED))
            throw new common_1.BadRequestException('Only pending or confirmed order can be cancelled');
        const claim = await this.orderRepo.updateOne({
            filter: { _id: id, userId: user._id, status: order.status },
            update: { $set: { status: enums_1.ORDER_STATUS.CANCELLED } },
        });
        if (!claim.matchedCount)
            throw new common_1.BadRequestException('Order status has changed, please try again');
        if (order.paymentMethod === enums_1.PAYMENT_PROVIDER.CASH_ON_DELIVERY) {
            await this.paymentRepo.findOneAndUpdate({
                filter: { orderId: order._id },
                update: { $set: { status: enums_1.PAYMENT_STATUS.CANCELLED } },
            });
            email_event_1.emailEmitter.emit(email_enums_1.EMAIL_EVENTS.ORDER_CANCELLED, {
                to: user.email,
                firstName: user.firstName,
                orderId: id.toString(),
            });
        }
        else if (order.paymentMethod === enums_1.PAYMENT_PROVIDER.STRIPE &&
            order.paidAt &&
            order.status === enums_1.ORDER_STATUS.CONFIRMED) {
            await this.paymentService.refundPayment(order.intentId);
            await this.orderRepo.updateOne({
                filter: { _id: id },
                update: { $set: { refundedAt: new Date() } },
            });
            await this.paymentRepo.findOneAndUpdate({
                filter: { orderId: order._id },
                update: { $set: { status: enums_1.PAYMENT_STATUS.REFUNDED } },
            });
            email_event_1.emailEmitter.emit(email_enums_1.EMAIL_EVENTS.ORDER_REFUNDED, {
                to: user.email,
                firstName: user.firstName,
                orderId: id.toString(),
                amount: order.total,
            });
        }
        else {
            await this.paymentRepo.findOneAndUpdate({
                filter: { orderId: order._id },
                update: { $set: { status: enums_1.PAYMENT_STATUS.CANCELLED } },
            });
            email_event_1.emailEmitter.emit(email_enums_1.EMAIL_EVENTS.ORDER_CANCELLED, {
                to: user.email,
                firstName: user.firstName,
                orderId: id.toString(),
            });
        }
        await Promise.all(order.items.map((item) => this.productRepo.updateOne({
            filter: { _id: item.productId },
            update: { $inc: { stock: item.quantity } },
        })));
        return this.orderRepo.findOne({
            filter: { _id: id },
            options: { lean: true },
        });
    }
    async findOrderOwner(userId) {
        return this.userRepo.findOne({
            filter: { _id: userId },
            options: { lean: true },
        });
    }
    async webhook(request) {
        const event = this.paymentService.webhook(request);
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const { orderId } = (session.metadata ?? {});
                if (!orderId)
                    return;
                const intentId = typeof session.payment_intent === 'string'
                    ? session.payment_intent
                    : session.payment_intent?.id;
                const result = await this.orderRepo.updateOne({
                    filter: { _id: orderId, status: enums_1.ORDER_STATUS.PENDING },
                    update: {
                        $set: {
                            status: enums_1.ORDER_STATUS.CONFIRMED,
                            intentId,
                            paidAt: new Date(),
                        },
                    },
                });
                if (!result.matchedCount)
                    return;
                const order = await this.orderRepo.findOne({
                    filter: { _id: orderId },
                    options: { lean: true },
                });
                if (!order)
                    return;
                await this.paymentRepo.updateOne({
                    filter: { orderId },
                    update: { $set: { status: enums_1.PAYMENT_STATUS.COMPLETED } },
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
                    email_event_1.emailEmitter.emit(email_enums_1.EMAIL_EVENTS.ORDER_CONFIRMED, {
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
                const intent = event.data.object;
                const { orderId } = (intent.metadata ?? {});
                if (!orderId)
                    return;
                const result = await this.orderRepo.updateOne({
                    filter: { _id: orderId, status: enums_1.ORDER_STATUS.PENDING },
                    update: {
                        $set: { status: enums_1.ORDER_STATUS.CANCELLED, intentId: intent.id },
                    },
                });
                if (!result.matchedCount)
                    return;
                const order = await this.orderRepo.findOne({
                    filter: { _id: orderId },
                    options: { lean: true },
                });
                if (!order)
                    return;
                await this.paymentRepo.updateOne({
                    filter: { orderId },
                    update: { $set: { status: enums_1.PAYMENT_STATUS.FAILED } },
                });
                await Promise.all(order.items.map((item) => this.productRepo.updateOne({
                    filter: { _id: item.productId },
                    update: { $inc: { stock: item.quantity } },
                })));
                const owner = await this.findOrderOwner(order.userId);
                if (owner) {
                    email_event_1.emailEmitter.emit(email_enums_1.EMAIL_EVENTS.ORDER_CANCELLED, {
                        to: owner.email,
                        firstName: owner.firstName,
                        orderId,
                    });
                }
                return;
            }
            case 'checkout.session.expired': {
                const session = event.data.object;
                const { orderId } = (session.metadata ?? {});
                if (!orderId)
                    return;
                const result = await this.orderRepo.updateOne({
                    filter: { _id: orderId, status: enums_1.ORDER_STATUS.PENDING },
                    update: { $set: { status: enums_1.ORDER_STATUS.CANCELLED } },
                });
                if (!result.matchedCount)
                    return;
                const order = await this.orderRepo.findOne({
                    filter: { _id: orderId },
                    options: { lean: true },
                });
                if (!order)
                    return;
                await this.paymentRepo.updateOne({
                    filter: { orderId },
                    update: { $set: { status: enums_1.PAYMENT_STATUS.FAILED } },
                });
                await Promise.all(order.items.map((item) => this.productRepo.updateOne({
                    filter: { _id: item.productId },
                    update: { $inc: { stock: item.quantity } },
                })));
                const owner = await this.findOrderOwner(order.userId);
                if (owner) {
                    email_event_1.emailEmitter.emit(email_enums_1.EMAIL_EVENTS.ORDER_CANCELLED, {
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
};
exports.CustomerService = CustomerService;
exports.CustomerService = CustomerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [order_repo_1.OrderRepo,
        cart_repo_1.CartRepo,
        product_repo_1.ProductRepo,
        payment_service_1.PaymentService,
        payment_repo_1.PaymentRepo,
        config_1.ConfigService,
        aws_1.S3Service,
        coupon_repo_1.CouponRepo,
        repositories_1.UserRepo])
], CustomerService);
//# sourceMappingURL=customer.service.js.map