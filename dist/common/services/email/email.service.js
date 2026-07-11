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
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer_1 = require("nodemailer");
const email_enums_1 = require("../../enums/email.enums");
const email_event_1 = require("../../events/email.event");
let EmailService = class EmailService {
    configService;
    transporter;
    constructor(configService) {
        this.configService = configService;
        this.transporter = (0, nodemailer_1.createTransport)({
            service: this.configService.get('SMTP_SERVICE'),
            port: Number(this.configService.get('SMTP_PORT')),
            auth: {
                user: this.configService.get('SMTP_USER'),
                pass: this.configService.get('SMTP_PASS'),
            },
        });
    }
    onModuleInit() {
        email_event_1.emailEmitter.on(email_enums_1.EMAIL_EVENTS.FORGOT_PASSWORD, async ({ to, firstName, otp }) => {
            await this.sendMail(to, 'Reset your password', {
                html: `<p>Hi ${firstName}, your OTP is <b>${otp}</b></p>`,
            });
        });
        email_event_1.emailEmitter.on(email_enums_1.EMAIL_EVENTS.VERIFY_EMAIL, async ({ to, firstName, otp }) => {
            await this.sendMail(to, 'Verify your email', {
                html: `<p>Hi ${firstName}, your code is <b>${otp}</b></p>`,
            });
        });
        email_event_1.emailEmitter.on(email_enums_1.EMAIL_EVENTS.ORDER_CONFIRMED, async ({ to, firstName, orderId, total }) => {
            await this.sendMail(to, 'Your order has been confirmed', {
                html: `<p>Hi ${firstName}, your order <b>#${orderId}</b> has been confirmed. Total: <b>${total}</b>.</p>`,
            });
        });
        email_event_1.emailEmitter.on(email_enums_1.EMAIL_EVENTS.ORDER_CANCELLED, async ({ to, firstName, orderId }) => {
            await this.sendMail(to, 'Your order has been cancelled', {
                html: `<p>Hi ${firstName}, your order <b>#${orderId}</b> has been cancelled.</p>`,
            });
        });
        email_event_1.emailEmitter.on(email_enums_1.EMAIL_EVENTS.ORDER_REFUNDED, async ({ to, firstName, orderId, amount }) => {
            await this.sendMail(to, 'Your order has been refunded', {
                html: `<p>Hi ${firstName}, your order <b>#${orderId}</b> was cancelled and <b>${amount}</b> has been refunded to your original payment method.</p>`,
            });
        });
        email_event_1.emailEmitter.on(email_enums_1.EMAIL_EVENTS.ORDER_STATUS_UPDATED, async ({ to, firstName, orderId, status }) => {
            await this.sendMail(to, 'Your order status has been updated', {
                html: `<p>Hi ${firstName}, your order <b>#${orderId}</b> is now <b>${status}</b>.</p>`,
            });
        });
        email_event_1.emailEmitter.on(email_enums_1.EMAIL_EVENTS.USER_BANNED, async ({ to, firstName, reason }) => {
            await this.sendMail(to, 'Your account has been suspended', {
                html: `<p>Hi ${firstName}, your account has been suspended. Reason: <b>${reason}</b>.</p>`,
            });
        });
        email_event_1.emailEmitter.on(email_enums_1.EMAIL_EVENTS.USER_UNBANNED, async ({ to, firstName }) => {
            await this.sendMail(to, 'Your account has been reinstated', {
                html: `<p>Hi ${firstName}, your account has been reinstated and is now active again.</p>`,
            });
        });
    }
    async verifyConnection() {
        try {
            await this.transporter.verify();
            console.log('Server is ready to take our messages');
        }
        catch (err) {
            console.error('Verification failed:', err);
        }
    }
    async sendMail(to, subject, body) {
        try {
            return await this.transporter.sendMail({
                to,
                subject,
                ...body,
            });
        }
        catch (err) {
            throw err;
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map