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
const platform_express_1 = require("@nestjs/platform-express");
const mongoose_1 = require("mongoose");
const decorators_1 = require("../../../common/decorators");
const enums_1 = require("../../../common/enums");
const pipes_1 = require("../../../common/pipes");
const multer_util_1 = require("../../../common/utils/multer.util");
const createBrand_dto_1 = require("../dto/createBrand.dto");
const updateBrand_dto_1 = require("../dto/updateBrand.dto");
const admin_service_1 = require("./admin.service");
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    async createBrand(dto, logo) {
        const payload = await this.adminService.createBrand(dto, logo);
        return { message: 'Brand created successfully', payload };
    }
    async updateBrand(id, dto, logo) {
        const payload = await this.adminService.updateBrand(id, dto, logo);
        return { message: 'Brand updated successfully', payload };
    }
    async deleteBrand(id) {
        await this.adminService.deleteBrand(id);
        return { message: 'Brand deleted successfully' };
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('logo', multer_util_1.uploadBrandLogo)),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createBrand_dto_1.CreateBrandDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createBrand", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('logo', multer_util_1.uploadBrandLogo)),
    __param(0, (0, common_1.Param)('id', pipes_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, updateBrand_dto_1.UpdateBrandDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateBrand", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', pipes_1.ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteBrand", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin/brands'),
    (0, decorators_1.Auth)([enums_1.ROLE.ADMIN]),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map