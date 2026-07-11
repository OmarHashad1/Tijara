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
exports.CustomerController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const customer_service_1 = require("./customer.service");
const enums_1 = require("../../../common/enums");
const decorators_1 = require("../../../common/decorators");
const decorators_2 = require("../../../common/decorators");
const decorators_3 = require("../../../common/decorators");
const logout_dto_1 = require("../dto/logout.dto");
const update_profile_dto_1 = require("../dto/update-profile.dto");
const change_password_dto_1 = require("../dto/change-password.dto");
const add_address_dto_1 = require("../dto/add-address.dto");
const update_address_dto_1 = require("../dto/update-address.dto");
const add_payment_method_dto_1 = require("../dto/add-payment-method.dto");
let CustomerController = class CustomerController {
    customerService;
    constructor(customerService) {
        this.customerService = customerService;
    }
    profile(user) {
        return { message: 'User profile fetched successfully', data: user };
    }
    async updateProfile(user, dto) {
        await this.customerService.updateProfile(user._id, dto);
        return { message: 'Profile updated successfully' };
    }
    async changePassword(user, dto) {
        await this.customerService.changePassword(user._id, dto);
        return { message: 'Password changed successfully' };
    }
    async getAddresses(user) {
        const addresses = await this.customerService.getAddresses(user._id);
        return { message: 'Addresses fetched successfully', data: addresses };
    }
    async addAddress(user, dto) {
        await this.customerService.addAddress(user._id, dto);
        return { message: 'Address added successfully' };
    }
    async updateAddress(user, id, dto) {
        await this.customerService.updateAddress(user._id, new mongoose_1.Types.ObjectId(id), dto);
        return { message: 'Address updated successfully' };
    }
    async deleteAddress(user, id) {
        await this.customerService.deleteAddress(user._id, new mongoose_1.Types.ObjectId(id));
        return { message: 'Address deleted successfully' };
    }
    async getPaymentMethods(user) {
        const methods = await this.customerService.getPaymentMethods(user._id);
        return { message: 'Payment methods fetched successfully', data: methods };
    }
    async addPaymentMethod(user, dto) {
        await this.customerService.addPaymentMethod(user._id, dto);
        return { message: 'Payment method added successfully' };
    }
    async deletePaymentMethod(user, id) {
        await this.customerService.deletePaymentMethod(user._id, new mongoose_1.Types.ObjectId(id));
        return { message: 'Payment method removed successfully' };
    }
    async deleteAccount(user) {
        await this.customerService.deleteAccount(user._id);
        return { message: 'Account deleted successfully' };
    }
    async logout(req, dto) {
        const { user, decoded } = req.credentials;
        await this.customerService.logout({ type: dto.type, user, decoded });
        return { message: 'Logged out successfully' };
    }
};
exports.CustomerController = CustomerController;
__decorate([
    (0, common_1.Get)('/me'),
    __param(0, (0, decorators_2.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CustomerController.prototype, "profile", null);
__decorate([
    (0, common_1.Patch)('/me'),
    __param(0, (0, decorators_2.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Patch)('/me/password'),
    __param(0, (0, decorators_2.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Get)('/me/addresses'),
    __param(0, (0, decorators_2.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getAddresses", null);
__decorate([
    (0, common_1.Post)('/me/addresses'),
    __param(0, (0, decorators_2.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, add_address_dto_1.AddAddressDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "addAddress", null);
__decorate([
    (0, common_1.Patch)('/me/addresses/:id'),
    __param(0, (0, decorators_2.User)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_address_dto_1.UpdateAddressDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "updateAddress", null);
__decorate([
    (0, common_1.Delete)('/me/addresses/:id'),
    __param(0, (0, decorators_2.User)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "deleteAddress", null);
__decorate([
    (0, common_1.Get)('/me/payment-methods'),
    __param(0, (0, decorators_2.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getPaymentMethods", null);
__decorate([
    (0, common_1.Post)('/me/payment-methods'),
    __param(0, (0, decorators_2.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, add_payment_method_dto_1.AddPaymentMethodDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "addPaymentMethod", null);
__decorate([
    (0, common_1.Delete)('/me/payment-methods/:id'),
    __param(0, (0, decorators_2.User)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "deletePaymentMethod", null);
__decorate([
    (0, common_1.Delete)('/me'),
    __param(0, (0, decorators_2.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "deleteAccount", null);
__decorate([
    (0, decorators_3.SkipEmailVerification)(),
    (0, decorators_1.Auth)([enums_1.ROLE.ADMIN, enums_1.ROLE.USER]),
    (0, common_1.Post)('/logout'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, logout_dto_1.LogoutDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "logout", null);
exports.CustomerController = CustomerController = __decorate([
    (0, common_1.Controller)('user'),
    (0, decorators_1.Auth)([enums_1.ROLE.USER]),
    __metadata("design:paramtypes", [customer_service_1.CustomerService])
], CustomerController);
//# sourceMappingURL=customer.controller.js.map