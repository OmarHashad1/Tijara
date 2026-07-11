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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const decorators_1 = require("../../../common/decorators");
const enums_1 = require("../../../common/enums");
const pipes_1 = require("../../../common/pipes");
const create_review_dto_1 = require("../dto/create-review.dto");
const update_review_dto_1 = require("../dto/update-review.dto");
const customer_service_1 = require("./customer.service");
let CustomerController = class CustomerController {
    customerService;
    constructor(customerService) {
        this.customerService = customerService;
    }
    async createReview(user, productId, dto) {
        const payload = await this.customerService.createReview(user._id, productId, dto);
        return { message: 'Review submitted successfully', payload };
    }
    async updateReview(user, id, dto) {
        const payload = await this.customerService.updateReview(user._id, id, dto);
        return { message: 'Review updated successfully', payload };
    }
    async deleteReview(user, id) {
        await this.customerService.deleteReview(user._id, id);
        return { message: 'Review deleted successfully' };
    }
};
exports.CustomerController = CustomerController;
__decorate([
    (0, common_1.Post)('products/:productId/reviews'),
    __param(0, (0, decorators_1.User)()),
    __param(1, (0, common_1.Param)('productId', pipes_1.ParseObjectIdPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, mongoose_1.Types.ObjectId, create_review_dto_1.CreateReviewDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "createReview", null);
__decorate([
    (0, common_1.Patch)('reviews/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, decorators_1.User)()),
    __param(1, (0, common_1.Param)('id', pipes_1.ParseObjectIdPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, mongoose_1.Types.ObjectId, update_review_dto_1.UpdateReviewDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "updateReview", null);
__decorate([
    (0, common_1.Delete)('reviews/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, decorators_1.User)()),
    __param(1, (0, common_1.Param)('id', pipes_1.ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "deleteReview", null);
exports.CustomerController = CustomerController = __decorate([
    (0, common_1.Controller)(),
    (0, decorators_1.Auth)([enums_1.ROLE.USER]),
    __metadata("design:paramtypes", [customer_service_1.CustomerService])
], CustomerController);
//# sourceMappingURL=customer.controller.js.map