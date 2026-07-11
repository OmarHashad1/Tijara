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
exports.GuestService = void 0;
const common_1 = require("@nestjs/common");
const brand_repo_1 = require("../../../common/repositories/brand.repo");
let GuestService = class GuestService {
    brandRepo;
    constructor(brandRepo) {
        this.brandRepo = brandRepo;
    }
    async listBrands() {
        return this.brandRepo.find({ filter: {}, options: { lean: true } });
    }
    async getSingleBrand({ slug }) {
        const brand = await this.brandRepo.findOne({
            filter: { slug },
            options: { lean: true },
        });
        if (!brand)
            throw new common_1.NotFoundException('Brand not found');
        return brand;
    }
};
exports.GuestService = GuestService;
exports.GuestService = GuestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [brand_repo_1.BrandRepo])
], GuestService);
//# sourceMappingURL=guest.service.js.map