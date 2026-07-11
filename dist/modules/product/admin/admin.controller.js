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
const createProduct_dto_1 = require("../dto/createProduct.dto");
const updateProduct_dto_1 = require("../dto/updateProduct.dto");
const adjustStock_dto_1 = require("../dto/adjustStock.dto");
const admin_service_1 = require("./admin.service");
const MAX_PRODUCT_IMAGES = 10;
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    async createProduct(dto, images) {
        const payload = await this.adminService.createProduct(dto, images);
        return { message: 'Product created successfully', payload };
    }
    async updateProduct(id, dto, images) {
        const payload = await this.adminService.updateProduct(id, dto, images);
        return { message: 'Product updated successfully', payload };
    }
    async adjustStock(id, dto) {
        const payload = await this.adminService.adjustStock(id, dto);
        return { message: 'Stock updated successfully', payload };
    }
    async deleteProduct(id) {
        await this.adminService.deleteProduct(id);
        return { message: 'Product deleted successfully' };
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images', MAX_PRODUCT_IMAGES, multer_util_1.uploadProductImages)),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createProduct_dto_1.CreateProductDto, Array]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images', MAX_PRODUCT_IMAGES, multer_util_1.uploadProductImages)),
    __param(0, (0, common_1.Param)('id', pipes_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, updateProduct_dto_1.UpdateProductDto, Array]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Patch)(':id/stock'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', pipes_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, adjustStock_dto_1.AdjustStockDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "adjustStock", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', pipes_1.ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteProduct", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin/products'),
    (0, decorators_1.Auth)([enums_1.ROLE.ADMIN]),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map