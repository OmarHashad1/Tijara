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
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const brand_repo_1 = require("../../../common/repositories/brand.repo");
const category_repo_1 = require("../../../common/repositories/category.repo");
const slugify_util_1 = require("../../../common/utils/slugify.util");
const aws_1 = require("../../../common/services/aws");
const multer_enum_1 = require("../../../common/enums/multer.enum");
let AdminService = class AdminService {
    brandRepo;
    categoryRepo;
    s3Service;
    constructor(brandRepo, categoryRepo, s3Service) {
        this.brandRepo = brandRepo;
        this.categoryRepo = categoryRepo;
        this.s3Service = s3Service;
    }
    async assertCategoriesExist(categoryIds) {
        const uniqueIds = [...new Set(categoryIds)];
        const categories = await this.categoryRepo.find({
            filter: { _id: { $in: uniqueIds } },
            options: { lean: true },
        });
        if ((categories ?? []).length !== uniqueIds.length)
            throw new common_1.BadRequestException('One or more categories do not exist');
    }
    async uploadLogo(file, _id) {
        const key = await this.s3Service.uploadAsset({
            storageStrategy: multer_enum_1.STORAGE_TYPE.DISK,
            file,
            path: `brands/${_id}`,
        });
        return key;
    }
    async createBrand(dto, logo) {
        const brandExists = await this.brandRepo.findOne({
            filter: { name: dto.name },
        });
        if (brandExists)
            throw new common_1.ConflictException('A brand with this name already exists');
        await this.assertCategoriesExist(dto.categoryIds);
        const _id = new mongoose_1.Types.ObjectId();
        const Key = logo ? await this.uploadLogo(logo, _id) : null;
        const slug = (0, slugify_util_1.createSlug)(dto.name);
        const payload = await this.brandRepo.create({
            data: {
                _id,
                name: dto.name,
                slug,
                categoryIds: dto.categoryIds.map((id) => new mongoose_1.Types.ObjectId(id)),
                logo: Key,
                description: dto.description ?? null,
            },
        });
        if (!payload && logo) {
            await this.s3Service.deleteAsset({ Key });
            throw new common_1.BadRequestException();
        }
        return payload;
    }
    async updateBrand(id, dto, logo) {
        const brand = await this.brandRepo.findOne({
            filter: { _id: id },
            options: { lean: true },
        });
        if (!brand)
            throw new common_1.NotFoundException('Brand not found');
        const update = {};
        if (dto.name && dto.name !== brand.name) {
            const brandExists = await this.brandRepo.findOne({
                filter: { _id: { $ne: id }, name: dto.name },
            });
            if (brandExists)
                throw new common_1.ConflictException('A brand with this name already exists');
            update.name = dto.name;
            update.slug = (0, slugify_util_1.createSlug)(dto.name);
        }
        if (dto.categoryIds) {
            await this.assertCategoriesExist(dto.categoryIds);
            update.categoryIds = dto.categoryIds.map((id) => new mongoose_1.Types.ObjectId(id));
        }
        if (dto.description !== undefined)
            update.description = dto.description;
        if (logo) {
            update.logo = await this.uploadLogo(logo, id);
            if (brand.logo)
                await this.s3Service.deleteAsset({ Key: brand.logo });
        }
        const payload = await this.brandRepo.findOneAndUpdate({
            filter: { _id: id },
            update: { $set: update },
            options: { new: true },
        });
        return payload;
    }
    async deleteBrand(id) {
        const brand = await this.brandRepo.findOne({
            filter: { _id: id },
            options: { lean: true },
        });
        if (!brand)
            throw new common_1.NotFoundException('Brand not found');
        await this.brandRepo.deleteOne({ filter: { _id: id } });
        if (brand.logo)
            await this.s3Service.deleteAsset({ Key: brand.logo });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [brand_repo_1.BrandRepo,
        category_repo_1.CategoryRepo,
        aws_1.S3Service])
], AdminService);
//# sourceMappingURL=admin.service.js.map