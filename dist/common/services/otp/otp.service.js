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
exports.OtpService = void 0;
const security_service_1 = require("../security/security.service");
const common_1 = require("@nestjs/common");
const redis_service_1 = require("../redis/redis.service");
const tooManyrequest_exception_1 = require("../../exceptions/tooManyrequest.exception");
const generateOtp_util_1 = require("../../utils/generateOtp.util");
const email_1 = require("../email");
let OtpService = class OtpService {
    redisService;
    securityService;
    emailService;
    constructor(redisService, securityService, emailService) {
        this.redisService = redisService;
        this.securityService = securityService;
        this.emailService = emailService;
    }
    async send(userId, subject) {
        const blockTll = await this.redisService.getTTL(this.redisService.otpKeyBlock({ userId, subject }));
        if (blockTll > 0) {
            throw new tooManyrequest_exception_1.TooManyRequestsException(`Too many requests. Please try again in ${Math.ceil(blockTll / 60)} minutes`);
        }
        const currentOtpTtl = await this.redisService.getTTL(this.redisService.otpKey({ userId, subject }));
        if (currentOtpTtl > 0) {
            throw new tooManyrequest_exception_1.TooManyRequestsException(`Please wait ${Math.ceil(currentOtpTtl / 60)} minutes before requesting a new code`);
        }
        const otp = await (0, generateOtp_util_1.generateOTP)();
        const otpKey = this.redisService.otpKey({ userId, subject });
        await this.redisService.set({
            key: otpKey,
            value: { hashedOtp: await this.securityService.hash(otp), attempts: 1 },
            ttl: 2 * 60,
        });
        return otp;
    }
    async verify(userId, subject, otp) {
        const blockTll = await this.redisService.getTTL(this.redisService.otpKeyBlock({ userId, subject }));
        if (blockTll > 0) {
            throw new tooManyrequest_exception_1.TooManyRequestsException(`Too many requests. Please try again in ${Math.ceil(blockTll / 60)} minutes`);
        }
        const otpKey = this.redisService.otpKey({ userId, subject });
        const otpRaw = await this.redisService.get(otpKey);
        if (!otpRaw)
            throw new common_1.NotFoundException('No OTP found or code has expired');
        if (JSON.parse(otpRaw).verified) {
            throw new common_1.ConflictException('OTP has been verified ');
        }
        const { hashedOtp, attempts } = JSON.parse(otpRaw);
        if (!(await this.securityService.verify(hashedOtp, otp))) {
            const newAttempts = attempts + 1;
            if (newAttempts >= 5) {
                await Promise.all([
                    this.redisService.set({
                        key: this.redisService.otpKeyBlock({ userId, subject }),
                        value: 1,
                        ttl: 7 * 60,
                    }),
                    this.redisService.del(otpKey),
                ]);
                throw new tooManyrequest_exception_1.TooManyRequestsException('Too many failed attempts. Please request a new code');
            }
            await this.redisService.set({
                key: otpKey,
                value: { hashedOtp, attempts: newAttempts },
                ttl: await this.redisService.getTTL(otpKey),
            });
            throw new common_1.UnauthorizedException(`Invalid verification code. Only ${5 - newAttempts} attempts left`);
        }
        await this.redisService.set({
            key: otpKey,
            value: { verified: true },
            ttl: 10 * 60,
        });
        return true;
    }
    async consume(userId, subject) {
        const otpKey = this.redisService.otpKey({ userId, subject });
        const otpRaw = await this.redisService.get(otpKey);
        if (!otpRaw)
            throw new common_1.NotFoundException('No OTP found or code has expired');
        if (!JSON.parse(otpRaw).verified) {
            throw new common_1.ForbiddenException('OTP has not been verified yet');
        }
        await this.redisService.del(otpKey);
        return true;
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService,
        security_service_1.SecurityService,
        email_1.EmailService])
], OtpService);
//# sourceMappingURL=otp.service.js.map