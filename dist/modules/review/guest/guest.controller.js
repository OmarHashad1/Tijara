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
exports.GuestController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const pipes_1 = require("../../../common/pipes");
const list_reviews_query_dto_1 = require("../dto/list-reviews-query.dto");
const guest_service_1 = require("./guest.service");
let GuestController = class GuestController {
    guestService;
    constructor(guestService) {
        this.guestService = guestService;
    }
    async listReviews(productId, query) {
        const payload = await this.guestService.listReviews(productId, query);
        return { message: 'Reviews fetched successfully', payload };
    }
};
exports.GuestController = GuestController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('productId', pipes_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, list_reviews_query_dto_1.ListReviewsQueryDto]),
    __metadata("design:returntype", Promise)
], GuestController.prototype, "listReviews", null);
exports.GuestController = GuestController = __decorate([
    (0, common_1.Controller)('products/:productId/reviews'),
    __metadata("design:paramtypes", [guest_service_1.GuestService])
], GuestController);
//# sourceMappingURL=guest.controller.js.map