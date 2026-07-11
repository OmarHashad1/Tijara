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
const repositories_1 = require("../../../common/repositories");
const redis_1 = require("../../../common/services/redis");
const security_1 = require("../../../common/services/security");
const types_1 = require("../../../common/types");
let CustomerService = class CustomerService {
    userRepo;
    redisService;
    securityService;
    constructor(userRepo, redisService, securityService) {
        this.userRepo = userRepo;
        this.redisService = redisService;
        this.securityService = securityService;
    }
    async logout({ type, user, decoded, }) {
        const { jti, iat } = decoded;
        switch (type) {
            case types_1.LOGOUT_TYPE.DEVICE: {
                await this.redisService.set({
                    key: this.redisService.revokedTokenKey({ jti, userId: user._id }),
                    value: jti,
                    ttl: iat + 7 * 24 * 60 * 60 - Math.floor(Date.now() / 1000),
                });
                break;
            }
            case types_1.LOGOUT_TYPE.ALL: {
                await this.userRepo.updateOne({
                    filter: { _id: user._id },
                    update: { credentialsChangedAt: new Date() },
                });
                break;
            }
            default:
                throw new Error('Invalid Logout Type');
        }
    }
    async updateProfile(userId, dto) {
        await this.userRepo.updateOne({
            filter: { _id: userId },
            update: { $set: dto },
        });
    }
    async changePassword(userId, dto) {
        const user = await this.userRepo.findOne({
            filter: { _id: userId },
            projection: { password: 1, oldPasswords: 1 },
            options: { lean: true },
        });
        if (!user?.password ||
            !(await this.securityService.verify(user.password, dto.oldPassword))) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        for (const old of user.oldPasswords ?? []) {
            if (await this.securityService.verify(old, dto.newPassword)) {
                throw new common_1.BadRequestException('Password was used before');
            }
        }
        await this.userRepo.updateOne({
            filter: { _id: userId },
            update: {
                $set: {
                    password: await this.securityService.hash(dto.newPassword),
                    credentialsChangedAt: new Date(),
                },
                $push: { oldPasswords: user.password },
            },
        });
    }
    async getAddresses(userId) {
        const user = await this.userRepo.findOne({
            filter: { _id: userId },
            projection: { addresses: 1 },
            options: { lean: true },
        });
        return user?.addresses ?? [];
    }
    async addAddress(userId, dto) {
        if (dto.isDefault) {
            await this.userRepo.updateOne({
                filter: { _id: userId },
                update: { $set: { 'addresses.$[].isDefault': false } },
            });
        }
        await this.userRepo.updateOne({
            filter: { _id: userId },
            update: { $push: { addresses: dto } },
        });
    }
    async updateAddress(userId, addressId, dto) {
        if (dto.isDefault) {
            await this.userRepo.updateOne({
                filter: { _id: userId },
                update: { $set: { 'addresses.$[].isDefault': false } },
            });
        }
        await this.userRepo.updateOne({
            filter: { _id: userId, 'addresses._id': addressId },
            update: {
                $set: {
                    ...(dto.city !== undefined && { 'addresses.$.city': dto.city }),
                    ...(dto.country !== undefined && {
                        'addresses.$.country': dto.country,
                    }),
                    ...(dto.isDefault !== undefined && {
                        'addresses.$.isDefault': dto.isDefault,
                    }),
                },
            },
        });
    }
    async deleteAddress(userId, addressId) {
        await this.userRepo.updateOne({
            filter: { _id: userId },
            update: { $pull: { addresses: { _id: addressId } } },
        });
    }
    async getPaymentMethods(userId) {
        const user = await this.userRepo.findOne({
            filter: { _id: userId },
            projection: { paymentsMethod: 1 },
            options: { lean: true },
        });
        return user?.paymentsMethod ?? [];
    }
    async addPaymentMethod(userId, dto) {
        if (dto.isDefault) {
            await this.userRepo.updateOne({
                filter: { _id: userId },
                update: { $set: { 'paymentsMethod.$[].isDefault': false } },
            });
        }
        await this.userRepo.updateOne({
            filter: { _id: userId },
            update: { $push: { paymentsMethod: dto } },
        });
    }
    async deleteAccount(userId) {
        const now = new Date();
        await this.userRepo.updateOne({
            filter: { _id: userId },
            update: { $set: { deletedAt: now, credentialsChangedAt: now } },
        });
    }
    async deletePaymentMethod(userId, paymentId) {
        await this.userRepo.updateOne({
            filter: { _id: userId },
            update: { $pull: { paymentsMethod: { _id: paymentId } } },
        });
    }
};
exports.CustomerService = CustomerService;
exports.CustomerService = CustomerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [repositories_1.UserRepo,
        redis_1.RedisService,
        security_1.SecurityService])
], CustomerService);
//# sourceMappingURL=customer.service.js.map