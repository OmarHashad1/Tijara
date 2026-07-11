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
exports.CustomerService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const product_repo_1 = require("../../../common/repositories/product.repo");
const wishlist_repo_1 = require("../../../common/repositories/wishlist.repo");
let CustomerService = class CustomerService {
    wishlistRepo;
    productRepo;
    constructor(wishlistRepo, productRepo) {
        this.wishlistRepo = wishlistRepo;
        this.productRepo = productRepo;
    }
    async findOrCreateWishlist(userId) {
        const wishlist = await this.wishlistRepo.findOne({
            filter: { userId },
            options: { lean: true },
        });
        if (wishlist)
            return wishlist;
        return this.wishlistRepo.create({ data: { userId, productIds: [] } });
    }
    async getWishlist(userId) {
        return this.findOrCreateWishlist(userId);
    }
    async addItem(userId, dto) {
        const product = await this.productRepo.findOne({
            filter: { _id: dto.productId },
            options: { lean: true },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        await this.findOrCreateWishlist(userId);
        await this.wishlistRepo.updateOne({
            filter: { userId },
            update: { $addToSet: { productIds: new mongoose_1.Types.ObjectId(dto.productId) } },
        });
        return this.wishlistRepo.findOne({
            filter: { userId },
            options: { lean: true },
        });
    }
    async removeItem(userId, productId) {
        const result = await this.wishlistRepo.updateOne({
            filter: { userId },
            update: { $pull: { productIds: productId } },
        });
        if (!result.matchedCount)
            throw new common_1.NotFoundException('Wishlist not found');
        return this.wishlistRepo.findOne({
            filter: { userId },
            options: { lean: true },
        });
    }
};
exports.CustomerService = CustomerService;
exports.CustomerService = CustomerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [wishlist_repo_1.WishlistRepo,
        product_repo_1.ProductRepo])
], CustomerService);
//# sourceMappingURL=customer.service.js.map