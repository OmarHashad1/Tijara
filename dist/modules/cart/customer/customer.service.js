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
const cart_repo_1 = require("../../../common/repositories/cart.repo");
const product_repo_1 = require("../../../common/repositories/product.repo");
let CustomerService = class CustomerService {
    cartRepo;
    productRepo;
    constructor(cartRepo, productRepo) {
        this.cartRepo = cartRepo;
        this.productRepo = productRepo;
    }
    async findOrCreateCart(userId) {
        const cart = await this.cartRepo.findOne({
            filter: { userId },
            options: { lean: true },
        });
        if (cart)
            return cart;
        return this.cartRepo.create({ data: { userId, items: [] } });
    }
    async getCart(userId) {
        return this.findOrCreateCart(userId);
    }
    async addItem(userId, dto) {
        const product = await this.productRepo.findOne({
            filter: { _id: dto.productId },
            options: { lean: true },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const cart = await this.findOrCreateCart(userId);
        const productId = new mongoose_1.Types.ObjectId(dto.productId);
        const hasItem = cart.items.some((item) => item.productId.toString() === dto.productId);
        if (product?.stock < dto.quantity) {
            console.log('if block');
            throw new common_1.UnprocessableEntityException(`Insufficient stock for product ${product.name}`);
        }
        if (hasItem) {
            await this.cartRepo.updateOne({
                filter: { userId, 'items.productId': productId },
                update: { $inc: { 'items.$.quantity': dto.quantity } },
            });
        }
        else {
            await this.cartRepo.updateOne({
                filter: { userId },
                update: { $push: { items: { productId, quantity: dto.quantity } } },
            });
        }
        return this.cartRepo.findOne({
            filter: { userId },
            options: { lean: true },
        });
    }
    async updateItemQuantity(userId, productId, dto) {
        const product = await this.productRepo.findOne({
            filter: { _id: productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product?.stock < dto.quantity) {
            console.log('if block');
            throw new common_1.UnprocessableEntityException(`Insufficient stock for product "${product.name}"`);
        }
        const result = await this.cartRepo.updateOne({
            filter: { userId, 'items.productId': productId },
            update: { $set: { 'items.$.quantity': dto.quantity } },
        });
        if (!result.matchedCount)
            throw new common_1.NotFoundException('Cart item not found');
        return this.cartRepo.findOne({
            filter: { userId },
            options: { lean: true },
        });
    }
    async removeItem(userId, productId) {
        const result = await this.cartRepo.updateOne({
            filter: { userId },
            update: { $pull: { items: { productId } } },
        });
        if (!result.matchedCount)
            throw new common_1.NotFoundException('Cart not found');
        return this.cartRepo.findOne({
            filter: { userId },
            options: { lean: true },
        });
    }
    async clearCart(userId) {
        await this.findOrCreateCart(userId);
        await this.cartRepo.updateOne({
            filter: { userId },
            update: { $set: { items: [] } },
        });
    }
};
exports.CustomerService = CustomerService;
exports.CustomerService = CustomerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cart_repo_1.CartRepo,
        product_repo_1.ProductRepo])
], CustomerService);
//# sourceMappingURL=customer.service.js.map