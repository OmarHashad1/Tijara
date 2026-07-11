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
const getSingleBrand_dto_1 = require("../dto/getSingleBrand.dto");
const guest_service_1 = require("./guest.service");
let GuestController = class GuestController {
    guestService;
    constructor(guestService) {
        this.guestService = guestService;
    }
    async listBrands() {
        const payload = await this.guestService.listBrands();
        return { message: 'Brands retrieved successfully', payload };
    }
    async getSingleBrand(dto) {
        const payload = await this.guestService.getSingleBrand(dto);
        return { message: 'Brand fetched successfully', payload };
    }
};
exports.GuestController = GuestController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GuestController.prototype, "listBrands", null);
__decorate([
    (0, common_1.Get)('/:slug'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [getSingleBrand_dto_1.getSingleBrand]),
    __metadata("design:returntype", Promise)
], GuestController.prototype, "getSingleBrand", null);
exports.GuestController = GuestController = __decorate([
    (0, common_1.Controller)('brands'),
    __metadata("design:paramtypes", [guest_service_1.GuestService])
], GuestController);
//# sourceMappingURL=guest.controller.js.map