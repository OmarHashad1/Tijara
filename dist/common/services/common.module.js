"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonModule = void 0;
const common_1 = require("@nestjs/common");
const security_1 = require("./security");
const redis_1 = require("./redis");
const email_1 = require("./email");
const jwt_1 = require("@nestjs/jwt");
const token_1 = require("./token");
const aws_1 = require("./aws");
const otp_1 = require("./otp");
const payment_1 = require("./payment");
let CommonModule = class CommonModule {
};
exports.CommonModule = CommonModule;
exports.CommonModule = CommonModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [jwt_1.JwtModule],
        exports: [security_1.SecurityService, redis_1.RedisService, email_1.EmailService, token_1.TokenService, aws_1.S3Service, otp_1.OtpService, payment_1.PaymentService],
        providers: [
            security_1.SecurityService,
            redis_1.RedisService,
            email_1.EmailService,
            token_1.TokenService,
            aws_1.S3Service,
            otp_1.OtpService,
            payment_1.PaymentService
        ],
    })
], CommonModule);
//# sourceMappingURL=common.module.js.map