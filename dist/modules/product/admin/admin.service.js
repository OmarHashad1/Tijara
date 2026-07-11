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
const product_repo_1 = require("../../../common/repositories/product.repo");
const slugify_util_1 = require("../../../common/utils/slugify.util");
const aws_1 = require("../../../common/services/aws");
const multer_enum_1 = require("../../../common/enums/multer.enum");
let AdminService = class AdminService {
    productRepo;
    categoryRepo;
    brandRepo;
    s3Service;
    constructor(productRepo, categoryRepo, brandRepo, s3Service) {
        this.productRepo = productRepo;
        this.categoryRepo = categoryRepo;
        this.brandRepo = brandRepo;
        this.s3Service = s3Service;
    }
    async assertCategoryAndBrand(categoryId, brandId) {
        const [category, brand] = await Promise.all([
            this.categoryRepo.findOne({
                filter: { _id: categoryId },
                options: { lean: true },
            }),
            this.brandRepo.findOne({
                filter: { _id: brandId },
                options: { lean: true },
            }),
        ]);
        if (!category)
            throw new common_1.BadRequestException('Category does not exist');
        if (!brand)
            throw new common_1.BadRequestException('Brand does not exist');
        if (!brand.categoryIds.some((id) => id.toString() === categoryId))
            throw new common_1.BadRequestException('Brand does not belong to the given category');
    }
    async uploadProductImages(files) {
        const Keys = await Promise.all(files.map((file) => this.s3Service.uploadAsset({
            storageStrategy: multer_enum_1.STORAGE_TYPE.MEMORY,
            file,
            path: 'products',
            ACL: 'public-read',
        })));
        return Keys;
    }
    async deleteProductImages(Keys) {
        const keys = Keys
            .filter((key) => key !== null);
        if (keys.length)
            await this.s3Service.deleteAssets(keys);
    }
    async createProduct(dto, files = []) {
        const productExists = await this.productRepo.findOne({
            filter: { name: dto.name },
        });
        if (productExists)
            throw new common_1.ConflictException('A product with this name already exists');
        await this.assertCategoryAndBrand(dto.categoryId, dto.brandId);
        const images = files.length ? await this.uploadProductImages(files) : [];
        const slug = (0, slugify_util_1.createSlug)(dto.name);
        const payload = await this.productRepo.create({
            data: {
                name: dto.name,
                slug,
                description: dto.description ?? null,
                price: dto.price,
                discountPercent: dto.discountPercent ?? 0,
                stock: dto.stock ?? 0,
                categoryId: new mongoose_1.Types.ObjectId(dto.categoryId),
                brandId: new mongoose_1.Types.ObjectId(dto.brandId),
                images,
            },
        });
        return payload;
    }
    async updateProduct(id, dto, files = []) {
        const product = await this.productRepo.findOne({
            filter: { _id: id },
            options: { lean: true },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const update = {};
        if (dto.name && dto.name !== product.name) {
            const productExists = await this.productRepo.findOne({
                filter: { _id: { $ne: id }, name: dto.name },
            });
            if (productExists)
                throw new common_1.ConflictException('A product with this name already exists');
            update.name = dto.name;
            update.slug = (0, slugify_util_1.createSlug)(dto.name);
        }
        if (dto.categoryId || dto.brandId) {
            const categoryId = dto.categoryId ?? product.categoryId.toString();
            const brandId = dto.brandId ?? product.brandId.toString();
            await this.assertCategoryAndBrand(categoryId, brandId);
            if (dto.categoryId)
                update.categoryId = new mongoose_1.Types.ObjectId(categoryId);
            if (dto.brandId)
                update.brandId = new mongoose_1.Types.ObjectId(brandId);
        }
        if (dto.description !== undefined)
            update.description = dto.description;
        if (dto.price !== undefined)
            update.price = dto.price;
        if (dto.discountPercent !== undefined)
            update.discountPercent = dto.discountPercent;
        if (files.length) {
            update.images = await this.uploadProductImages(files);
            await this.deleteProductImages(product.images);
        }
        const payload = await this.productRepo.findOneAndUpdate({
            filter: { _id: id },
            update: { $set: update },
            options: { new: true },
        });
        return payload;
    }
    async adjustStock(id, dto) {
        const product = await this.productRepo.findOne({
            filter: { _id: id },
            options: { lean: true },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const stock = product.stock + dto.quantity;
        if (stock < 0)
            throw new common_1.BadRequestException('Insufficient stock');
        const payload = await this.productRepo.findOneAndUpdate({
            filter: { _id: id },
            update: { $set: { stock } },
            options: { new: true },
        });
        return payload;
    }
    async deleteProduct(id) {
        const product = await this.productRepo.findOne({
            filter: { _id: id },
            options: { lean: true },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        await this.productRepo.deleteOne({ filter: { _id: id } });
        await this.deleteProductImages(product.images);
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [product_repo_1.ProductRepo,
        category_repo_1.CategoryRepo,
        brand_repo_1.BrandRepo,
        aws_1.S3Service])
], AdminService);
//# sourceMappingURL=admin.service.js.map