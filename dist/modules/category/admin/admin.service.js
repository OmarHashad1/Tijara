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
const enums_1 = require("../../../common/enums");
const common_1 = require("@nestjs/common");
const category_repo_1 = require("../../../common/repositories/category.repo");
const brand_repo_1 = require("../../../common/repositories/brand.repo");
const slugify_util_1 = require("../../../common/utils/slugify.util");
let AdminService = class AdminService {
    categoryRepo;
    brandRepo;
    constructor(categoryRepo, brandRepo) {
        this.categoryRepo = categoryRepo;
        this.brandRepo = brandRepo;
    }
    async createCategory(dto) {
        const { name, status = enums_1.CATEGORY_STATUS.DRAFT } = dto;
        const categoryExists = await this.categoryRepo.findOne({
            filter: { name: name },
        });
        if (categoryExists)
            throw new common_1.ConflictException('A category with this name already exists');
        const slug = (0, slugify_util_1.createSlug)(name);
        const payload = await this.categoryRepo.create({
            data: { name, status, slug },
        });
        return { id: payload.id, name, slug: payload.slug, status: payload.status };
    }
    async updateCategory(id, dto) {
        const category = await this.categoryRepo.findOne({
            filter: { _id: id },
            options: { lean: true },
        });
        if (!category)
            throw new common_1.NotFoundException('Category not found');
        const update = {};
        if (dto.name && dto.name !== category.name) {
            const categoryExists = await this.categoryRepo.findOne({
                filter: { _id: { $ne: id }, name: dto.name },
            });
            if (categoryExists)
                throw new common_1.ConflictException('A category with this name already exists');
            update.name = dto.name;
            update.slug = (0, slugify_util_1.createSlug)(dto.name);
        }
        if (dto.status)
            update.status = dto.status;
        const payload = await this.categoryRepo.findOneAndUpdate({
            filter: { _id: id },
            update: { $set: update },
            options: { new: true },
        });
        return payload;
    }
    async deleteCategory(id) {
        const result = await this.categoryRepo.deleteOne({ filter: { _id: id } });
        if (!result.deletedCount)
            throw new common_1.NotFoundException('Category not found');
        await this.brandRepo.updateMany({
            filter: { categoryIds: id },
            update: { $pull: { categoryIds: id } },
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [category_repo_1.CategoryRepo,
        brand_repo_1.BrandRepo])
], AdminService);
//# sourceMappingURL=admin.service.js.map