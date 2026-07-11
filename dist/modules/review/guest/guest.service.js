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
const product_repo_1 = require("../../../common/repositories/product.repo");
const review_repo_1 = require("../../../common/repositories/review.repo");
let GuestService = class GuestService {
    reviewRepo;
    productRepo;
    constructor(reviewRepo, productRepo) {
        this.reviewRepo = reviewRepo;
        this.productRepo = productRepo;
    }
    async listReviews(productId, query) {
        const product = await this.productRepo.findOne({
            filter: { _id: productId },
            options: { lean: true },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const { page = 1, size = 20 } = query;
        return this.reviewRepo.paginate({
            filter: { productId },
            options: {},
            page,
            size,
        });
    }
};
exports.GuestService = GuestService;
exports.GuestService = GuestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [review_repo_1.ReviewRepo,
        product_repo_1.ProductRepo])
], GuestService);
//# sourceMappingURL=guest.service.js.map