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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const decorators_1 = require("../../../common/decorators");
const enums_1 = require("../../../common/enums");
const pipes_1 = require("../../../common/pipes");
const create_coupon_dto_1 = require("../dto/create-coupon.dto");
const update_coupon_dto_1 = require("../dto/update-coupon.dto");
const list_coupons_query_dto_1 = require("../dto/list-coupons-query.dto");
const admin_service_1 = require("./admin.service");
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    async listCoupons(query) {
        const payload = await this.adminService.listCoupons(query);
        return { message: 'Coupons fetched successfully', payload };
    }
    async createCoupon(dto) {
        const payload = await this.adminService.createCoupon(dto);
        return { message: 'Coupon created successfully', payload };
    }
    async updateCoupon(id, dto) {
        const payload = await this.adminService.updateCoupon(id, dto);
        return { message: 'Coupon updated successfully', payload };
    }
    async deleteCoupon(id) {
        await this.adminService.deleteCoupon(id);
        return { message: 'Coupon deleted successfully' };
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_coupons_query_dto_1.ListCouponsQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listCoupons", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_coupon_dto_1.CreateCouponDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createCoupon", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', pipes_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, update_coupon_dto_1.UpdateCouponDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateCoupon", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', pipes_1.ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteCoupon", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin/coupons'),
    (0, decorators_1.Auth)([enums_1.ROLE.ADMIN]),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map