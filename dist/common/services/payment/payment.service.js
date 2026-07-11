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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const stripe_1 = __importDefault(require("stripe"));
let PaymentService = class PaymentService {
    configService;
    stripe;
    constructor(configService) {
        this.configService = configService;
        this.stripe = new stripe_1.default(this.configService.get('STRIPE_SECRET_KEY'));
    }
    async createCheckoutSession(opts) {
        return await this.stripe.checkout.sessions.create(opts);
    }
    async createCoupon(opts) {
        return this.stripe.coupons.create(opts);
    }
    webhook(req) {
        return this.stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], this.configService.get('STRIPE_HOOK_SECRET'));
    }
    async refundPayment(intentId) {
        const intent = await this.stripe.paymentIntents.retrieve(intentId);
        if (!intent)
            throw new common_1.NotFoundException('Intent not found');
        if (intent.status != 'succeeded') {
            throw new common_1.BadRequestException('Order refund can only be applied on succeeded payments');
        }
        return this.stripe.refunds.create({ payment_intent: intentId });
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map