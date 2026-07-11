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
const order_repo_1 = require("../../../common/repositories/order.repo");
const product_repo_1 = require("../../../common/repositories/product.repo");
const review_repo_1 = require("../../../common/repositories/review.repo");
const enums_1 = require("../../../common/enums");
let CustomerService = class CustomerService {
    reviewRepo;
    orderRepo;
    productRepo;
    constructor(reviewRepo, orderRepo, productRepo) {
        this.reviewRepo = reviewRepo;
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
    }
    async createReview(userId, productId, dto) {
        const product = await this.productRepo.findOne({
            filter: { _id: productId },
            options: { lean: true },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const order = await this.orderRepo.findOne({
            filter: { _id: dto.orderId, userId },
            options: { lean: true },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.status !== enums_1.ORDER_STATUS.DELIVERED)
            throw new common_1.BadRequestException('You can only review products from delivered orders');
        if (!order.items.some((item) => item.productId.toString() === productId.toString()))
            throw new common_1.BadRequestException('This product was not part of the given order');
        const existingReview = await this.reviewRepo.findOne({
            filter: { userId, productId },
            options: { lean: true },
        });
        if (existingReview)
            throw new common_1.ConflictException('You have already reviewed this product');
        const payload = await this.reviewRepo.create({
            data: {
                userId,
                productId,
                orderId: new mongoose_1.Types.ObjectId(dto.orderId),
                rating: dto.rating,
                comment: dto.comment ?? null,
            },
        });
        return payload;
    }
    async updateReview(userId, id, dto) {
        const review = await this.reviewRepo.findOne({
            filter: { _id: id, userId },
            options: { lean: true },
        });
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        const update = {};
        if (dto.rating !== undefined)
            update.rating = dto.rating;
        if (dto.comment !== undefined)
            update.comment = dto.comment;
        const payload = await this.reviewRepo.findOneAndUpdate({
            filter: { _id: id },
            update: { $set: update },
            options: { new: true },
        });
        return payload;
    }
    async deleteReview(userId, id) {
        const result = await this.reviewRepo.deleteOne({
            filter: { _id: id, userId },
        });
        if (!result.deletedCount)
            throw new common_1.NotFoundException('Review not found');
    }
};
exports.CustomerService = CustomerService;
exports.CustomerService = CustomerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [review_repo_1.ReviewRepo,
        order_repo_1.OrderRepo,
        product_repo_1.ProductRepo])
], CustomerService);
//# sourceMappingURL=customer.service.js.map