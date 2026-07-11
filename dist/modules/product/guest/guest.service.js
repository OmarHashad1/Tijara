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
const mongoose_1 = require("mongoose");
const product_repo_1 = require("../../../common/repositories/product.repo");
let GuestService = class GuestService {
    productRepo;
    constructor(productRepo) {
        this.productRepo = productRepo;
    }
    async listProducts(query) {
        const { search, categoryId, brandId, minPrice, maxPrice, page = 1, size = 20, } = query;
        const filter = {};
        if (search)
            filter.name = { $regex: search, $options: 'i' };
        if (categoryId)
            filter.categoryId = new mongoose_1.Types.ObjectId(categoryId);
        if (brandId)
            filter.brandId = new mongoose_1.Types.ObjectId(brandId);
        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {
                ...(minPrice !== undefined ? { $gte: minPrice } : {}),
                ...(maxPrice !== undefined ? { $lte: maxPrice } : {}),
            };
        }
        return this.productRepo.paginate({ filter, options: {}, page, size });
    }
    async getSingleProduct({ slug }) {
        const product = await this.productRepo.findOne({
            filter: { slug },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
};
exports.GuestService = GuestService;
exports.GuestService = GuestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [product_repo_1.ProductRepo])
], GuestService);
//# sourceMappingURL=guest.service.js.map