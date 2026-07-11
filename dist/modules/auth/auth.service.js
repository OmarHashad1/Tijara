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
exports.AuthService = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("@nestjs/common");
const repositories_1 = require("../../common/repositories");
const enums_1 = require("../../common/enums");
const email_enums_1 = require("../../common/enums/email.enums");
const token_1 = require("../../common/services/token");
const security_1 = require("../../common/services/security");
const otp_1 = require("../../common/services/otp");
const email_event_1 = require("../../common/events/email.event");
let AuthService = class AuthService {
    userRepo;
    tokenService;
    securityService;
    otpService;
    constructor(userRepo, tokenService, securityService, otpService) {
        this.userRepo = userRepo;
        this.tokenService = tokenService;
        this.securityService = securityService;
        this.otpService = otpService;
    }
    async findUser(email) {
        const user = await this.userRepo.findOne({
            filter: { email: email },
            projection: {
                email: 1,
                _id: 1,
                firstName: 1,
                password: 1,
                oldPasswords: 1,
            },
            options: { lean: false },
        });
        return user;
    }
    async login(dto) {
        const user = await this.userRepo.findOne({
            filter: { email: dto.email },
            options: { lean: false, paranoId: false },
            projection: { _id: 1, email: 1, role: 1, password: 1 },
        });
        if (!user ||
            !user.password ||
            !(await this.securityService.verify(user.password, dto.password)))
            throw new common_1.BadRequestException('Wrong email or password');
        const { _id, email, role } = user;
        const token = await this.tokenService.generateToken({
            payload: { _id, email, role },
        });
        const { accessToken, refreshToken } = await this.tokenService.generateTokens({
            _id: user._id,
            email: user.email,
            role: user.role,
        });
        return {
            accessToken,
            refreshToken,
        };
    }
    async signup(dto) {
        const existing = await this.userRepo.findOne({
            filter: { email: dto.email },
            projection: { _id: 1 },
            options: { lean: true },
        });
        if (existing)
            throw new common_1.ConflictException('Email is already in use');
        const user = await this.userRepo.create({
            data: { ...dto, role: enums_1.ROLE.USER },
        });
        return {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        };
    }
    async refreshToken(user, decoded) {
        const accessToken = await this.tokenService.generateToken({
            payload: {
                _id: mongoose_1.Types.ObjectId.createFromHexString(decoded._id),
                email: user.email,
                role: user.role,
            },
            options: {
                jwtid: decoded.jti,
                expiresIn: '30M',
            },
        });
        return accessToken;
    }
    async sendVerifyEmailOTP(userId, email, firstName) {
        const otp = await this.otpService.send(userId, email_enums_1.EMAIL_EVENTS.VERIFY_EMAIL);
        email_event_1.emailEmitter.emit(email_enums_1.EMAIL_EVENTS.VERIFY_EMAIL, { to: email, firstName, otp });
    }
    async checkVerifyEmailOTP(userId, otp) {
        await this.otpService.verify(userId, email_enums_1.EMAIL_EVENTS.VERIFY_EMAIL, otp);
        await this.userRepo.updateOne({
            filter: { _id: userId },
            update: { $set: { isEmailVerified: true } },
        });
    }
    async sendForgotPasswordOTP(email) {
        const user = await this.findUser(email);
        if (!user)
            return;
        const otp = await this.otpService.send(user._id, email_enums_1.EMAIL_EVENTS.FORGOT_PASSWORD);
        email_event_1.emailEmitter.emit(email_enums_1.EMAIL_EVENTS.FORGOT_PASSWORD, {
            to: user.email,
            firstName: user.firstName,
            otp,
        });
    }
    async verifyForgotPasswordOTP(email, otp) {
        const user = await this.findUser(email);
        if (!user)
            return;
        await this.otpService.verify(user._id, email_enums_1.EMAIL_EVENTS.FORGOT_PASSWORD, otp);
    }
    async resetPassword(dto) {
        const user = await this.findUser(dto.email);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        for (const old of user.oldPasswords ?? []) {
            if (await this.securityService.verify(old, dto.newPassword))
                throw new common_1.BadRequestException('Password was used before');
        }
        await this.otpService.consume(user._id, email_enums_1.EMAIL_EVENTS.FORGOT_PASSWORD);
        await this.userRepo.updateOne({
            filter: { _id: user._id, email: dto.email },
            update: {
                $set: {
                    password: await this.securityService.hash(dto.newPassword),
                    credentialsChangedAt: new Date(),
                },
                $push: { oldPasswords: user.password },
            },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [repositories_1.UserRepo,
        token_1.TokenService,
        security_1.SecurityService,
        otp_1.OtpService])
], AuthService);
//# sourceMappingURL=auth.service.js.map