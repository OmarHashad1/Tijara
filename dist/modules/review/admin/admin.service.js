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
const review_repo_1 = require("../../../common/repositories/review.repo");
let AdminService = class AdminService {
    reviewRepo;
    constructor(reviewRepo) {
        this.reviewRepo = reviewRepo;
    }
    async listReviews(query) {
        const { productId, userId, rating, page = 1, size = 20 } = query;
        const filter = {};
        if (productId)
            filter.productId = new mongoose_1.Types.ObjectId(productId);
        if (userId)
            filter.userId = new mongoose_1.Types.ObjectId(userId);
        if (rating)
            filter.rating = rating;
        return this.reviewRepo.paginate({ filter, options: {}, page, size });
    }
    async deleteReview(id) {
        const result = await this.reviewRepo.deleteOne({ filter: { _id: id } });
        if (!result.deletedCount)
            throw new common_1.NotFoundException('Review not found');
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [review_repo_1.ReviewRepo])
], AdminService);
//# sourceMappingURL=admin.service.js.map