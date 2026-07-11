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
const enums_1 = require("../../../common/enums");
const brand_repo_1 = require("../../../common/repositories/brand.repo");
const category_repo_1 = require("../../../common/repositories/category.repo");
let GuestService = class GuestService {
    categoryRepo;
    brandRepo;
    constructor(categoryRepo, brandRepo) {
        this.categoryRepo = categoryRepo;
        this.brandRepo = brandRepo;
    }
    async listCategories() {
        return this.categoryRepo.find({
            filter: { status: enums_1.CATEGORY_STATUS.PUBLISHED },
            projection: { _id: 1, name: 1, slug: 1, status: 1 },
            options: { lean: false },
        });
    }
    async getSingleCategory({ slug }) {
        const category = await this.categoryRepo.findOne({
            filter: { slug, status: enums_1.CATEGORY_STATUS.PUBLISHED },
            projection: { _id: 1, name: 1, slug: 1, status: 1 },
            options: { lean: false },
        });
        if (!category)
            throw new common_1.NotFoundException('Category not found');
        const brands = await this.brandRepo.find({
            filter: { categoryIds: category._id },
        });
        return { ...category.toObject({ virtuals: true }), brands };
    }
    async listCategoryBrands(id) {
        const category = await this.categoryRepo.findOne({
            filter: { _id: id, status: enums_1.CATEGORY_STATUS.PUBLISHED },
            options: { lean: true },
        });
        if (!category)
            throw new common_1.NotFoundException('Category not found');
        return this.brandRepo.find({ filter: { categoryIds: id } });
    }
};
exports.GuestService = GuestService;
exports.GuestService = GuestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [category_repo_1.CategoryRepo,
        brand_repo_1.BrandRepo])
], GuestService);
//# sourceMappingURL=guest.service.js.map