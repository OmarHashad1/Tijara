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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const coupon_repo_1 = require("../../../common/repositories/coupon.repo");
const enums_1 = require("../../../common/enums");
let AdminService = class AdminService {
    couponRepo;
    constructor(couponRepo) {
        this.couponRepo = couponRepo;
    }
    async listCoupons(query) {
        const { search, page = 1, size = 20 } = query;
        const filter = {};
        if (search)
            filter.code = { $regex: search, $options: 'i' };
        return this.couponRepo.paginate({ filter, options: {}, page, size });
    }
    async createCoupon(dto) {
        const code = dto.code.trim().toUpperCase();
        const couponExists = await this.couponRepo.findOne({
            filter: { code },
            options: { lean: true },
        });
        if (couponExists)
            throw new common_1.ConflictException('A coupon with this code already exists');
        if (dto.discountType === enums_1.DISCOUNT_TYPE.PERCENT && dto.discountValue > 100)
            throw new common_1.BadRequestException('Percent discount value cannot exceed 100');
        const expiresAt = new Date(dto.expiresAt);
        if (expiresAt <= new Date())
            throw new common_1.BadRequestException('Expiry date must be in the future');
        const payload = await this.couponRepo.create({
            data: {
                code,
                discountType: dto.discountType,
                discountValue: dto.discountValue,
                expiresAt,
                usageLimit: dto.usageLimit,
                timesUsed: 0,
            },
        });
        return payload;
    }
    async updateCoupon(id, dto) {
        const coupon = await this.couponRepo.findOne({
            filter: { _id: id },
            options: { lean: true },
        });
        if (!coupon)
            throw new common_1.NotFoundException('Coupon not found');
        const update = {};
        if (dto.code) {
            const code = dto.code.trim().toUpperCase();
            if (code !== coupon.code) {
                const couponExists = await this.couponRepo.findOne({
                    filter: { _id: { $ne: id }, code },
                    options: { lean: true },
                });
                if (couponExists)
                    throw new common_1.ConflictException('A coupon with this code already exists');
                update.code = code;
            }
        }
        const effectiveType = dto.discountType ?? coupon.discountType;
        const effectiveValue = dto.discountValue ?? coupon.discountValue;
        if (effectiveType === enums_1.DISCOUNT_TYPE.PERCENT && effectiveValue > 100)
            throw new common_1.BadRequestException('Percent discount value cannot exceed 100');
        if (dto.discountType !== undefined)
            update.discountType = dto.discountType;
        if (dto.discountValue !== undefined)
            update.discountValue = dto.discountValue;
        if (dto.expiresAt !== undefined) {
            const expiresAt = new Date(dto.expiresAt);
            if (expiresAt <= new Date())
                throw new common_1.BadRequestException('Expiry date must be in the future');
            update.expiresAt = expiresAt;
        }
        if (dto.usageLimit !== undefined) {
            if (dto.usageLimit < coupon.timesUsed)
                throw new common_1.BadRequestException('Usage limit cannot be less than the number of times already used');
            update.usageLimit = dto.usageLimit;
        }
        const payload = await this.couponRepo.findOneAndUpdate({
            filter: { _id: id },
            update: { $set: update },
            options: { new: true },
        });
        return payload;
    }
    async deleteCoupon(id) {
        const result = await this.couponRepo.deleteOne({ filter: { _id: id } });
        if (!result.deletedCount)
            throw new common_1.NotFoundException('Coupon not found');
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [coupon_repo_1.CouponRepo])
], AdminService);
//# sourceMappingURL=admin.service.js.map