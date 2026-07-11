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
const common_1 = require("@nestjs/common");
const coupon_repo_1 = require("../../../common/repositories/coupon.repo");
let CustomerService = class CustomerService {
    couponRepo;
    constructor(couponRepo) {
        this.couponRepo = couponRepo;
    }
    async validateCoupon(dto) {
        const coupon = await this.couponRepo.findOne({
            filter: { code: dto.code.trim().toUpperCase() },
            options: { lean: true },
        });
        if (!coupon)
            throw new common_1.NotFoundException('Coupon not found');
        if (coupon.expiresAt < new Date())
            throw new common_1.BadRequestException('Coupon has expired');
        if (coupon.timesUsed >= coupon.usageLimit)
            throw new common_1.BadRequestException('Coupon usage limit reached');
        return coupon;
    }
};
exports.CustomerService = CustomerService;
exports.CustomerService = CustomerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [coupon_repo_1.CouponRepo])
], CustomerService);
//# sourceMappingURL=customer.service.js.map