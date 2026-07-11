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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const signup_dto_1 = require("./dto/signup.dto");
const verify_otp_dto_1 = require("./dto/verify-otp.dto");
const cookie_config_1 = require("../../configs/cookie.config");
const auth_1 = require("../../common/guards/auth");
const auth_enum_1 = require("../../common/enums/auth.enum");
const forgotPasswordOtp_dto_1 = require("./dto/forgotPasswordOtp.dto");
const verifyForgotPasswordOtp_dto_1 = require("./dto/verifyForgotPasswordOtp.dto");
const resetPassword_dto_1 = require("./dto/resetPassword.dto");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async login(req, dto, res) {
        try {
            const { accessToken, refreshToken } = await this.authService.login(dto);
            res.cookie('accessToken', accessToken, cookie_config_1.ACCESS_COOKIE_OPTION);
            res.cookie('refreshToken', refreshToken, cookie_config_1.REFRESH_COOKIE_OPTION);
            return {
                message: 'Logged in successfully!',
            };
        }
        catch (err) {
            throw err;
        }
    }
    async signup(req, dto) {
        try {
            const payload = await this.authService.signup(dto);
            return { message: 'User created successfully', payload };
        }
        catch (err) {
            if (err?.code === 11000)
                throw new common_1.ConflictException('Email already in use');
            throw err;
        }
    }
    async refreshToken(req, res) {
        try {
            const { user, decoded } = req.credentials;
            const accessToken = await this.authService.refreshToken(user, decoded);
            res.cookie('accessToken', accessToken, cookie_config_1.ACCESS_COOKIE_OPTION);
            return {};
        }
        catch (err) {
            throw err;
        }
    }
    async sendVerifyEmailOTP(req) {
        const { user } = req.credentials;
        if (user.isEmailVerified)
            throw new common_1.BadRequestException('User email is already verified');
        await this.authService.sendVerifyEmailOTP(user._id, user.email, user.firstName);
        return { message: 'Verification code sent to your email' };
    }
    async checkVerifyEmailOTP(req, dto) {
        const { user } = req.credentials;
        await this.authService.checkVerifyEmailOTP(user._id, dto.otp);
        return { message: 'Email verified successfully' };
    }
    async sendForgotPasswordOTP(dto) {
        await this.authService.sendForgotPasswordOTP(dto.email);
        return {
            message: 'If this email is registered, you will receive a code shortly',
        };
    }
    async verfiyForgotPasswordOtp(dto) {
        await this.authService.verifyForgotPasswordOTP(dto.email, dto.otp);
        return {
            message: 'OTP has been verified successfully',
        };
    }
    async resetPassword(dto) {
        await this.authService.resetPassword(dto);
        return {
            message: 'Password reset successfully',
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('/login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('/signup'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe({
        stopAtFirstError: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, signup_dto_1.SignupDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('/refresh-token'),
    (0, common_1.UseGuards)(auth_1.AuthenticationGuard),
    (0, common_1.SetMetadata)('tokenType', auth_enum_1.TOKEN_TYPE.REFRESH),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('/send-verify-email'),
    (0, common_1.UseGuards)(auth_1.AuthenticationGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendVerifyEmailOTP", null);
__decorate([
    (0, common_1.Post)('/check-verify-email'),
    (0, common_1.UseGuards)(auth_1.AuthenticationGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe({ stopAtFirstError: true, whitelist: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, verify_otp_dto_1.VerifyOtpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkVerifyEmailOTP", null);
__decorate([
    (0, common_1.Post)('/send-forgot-password-otp'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgotPasswordOtp_dto_1.ForgotPasswordOtp]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendForgotPasswordOTP", null);
__decorate([
    (0, common_1.Post)('/verify-forgot-password-otp'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verifyForgotPasswordOtp_dto_1.verfiyForgotPasswordOtp]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verfiyForgotPasswordOtp", null);
__decorate([
    (0, common_1.Patch)('/reset-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [resetPassword_dto_1.ForgotPassword]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map