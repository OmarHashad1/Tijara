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
exports.GuestController = void 0;
const common_1 = require("@nestjs/common");
const getSingleProduct_dto_1 = require("../dto/getSingleProduct.dto");
const listProductsQuery_dto_1 = require("../dto/listProductsQuery.dto");
const guest_service_1 = require("./guest.service");
const interceptors_1 = require("../../../common/interceptors");
const decorators_1 = require("../../../common/decorators");
let GuestController = class GuestController {
    guestService;
    constructor(guestService) {
        this.guestService = guestService;
    }
    async listProducts(query) {
        const payload = await this.guestService.listProducts(query);
        return { message: 'Products retrieved successfully', payload };
    }
    async getSingleProduct(dto) {
        const payload = await this.guestService.getSingleProduct(dto);
        return { message: 'Product fetched successfully', payload };
    }
};
exports.GuestController = GuestController;
__decorate([
    (0, decorators_1.TTL)(20),
    (0, common_1.UseInterceptors)(interceptors_1.RedisCacheInterceptor),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [listProductsQuery_dto_1.ListProductsQueryDto]),
    __metadata("design:returntype", Promise)
], GuestController.prototype, "listProducts", null);
__decorate([
    (0, common_1.Get)('/:slug'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [getSingleProduct_dto_1.getSingleProduct]),
    __metadata("design:returntype", Promise)
], GuestController.prototype, "getSingleProduct", null);
exports.GuestController = GuestController = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [guest_service_1.GuestService])
], GuestController);
//# sourceMappingURL=guest.controller.js.map