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
const checkout_dto_1 = require("../dto/checkout.dto");
const list_orders_query_dto_1 = require("../dto/list-orders-query.dto");
const customer_service_1 = require("./customer.service");
let CustomerController = class CustomerController {
    customerService;
    constructor(customerService) {
        this.customerService = customerService;
    }
    async checkout(user, dto) {
        const payload = await this.customerService.checkout(user, dto);
        return { message: 'Order placed successfully', payload };
    }
    async listOrders(user, query) {
        const payload = await this.customerService.listOrders(user._id, query);
        return { message: 'Orders fetched successfully', payload };
    }
    async getOrder(user, id) {
        const payload = await this.customerService.getOrder(user._id, id);
        return { message: 'Order fetched successfully', payload };
    }
    async cancelOrder(user, id) {
        const payload = await this.customerService.cancelOrder(user, id);
        return { message: 'Order cancelled successfully', payload };
    }
    async orderWebhook(req) {
        return await this.customerService.webhook(req);
    }
};
exports.CustomerController = CustomerController;
__decorate([
    (0, decorators_1.Auth)([enums_1.ROLE.USER]),
    (0, common_1.Post)(),
    __param(0, (0, decorators_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, checkout_dto_1.CheckoutDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "checkout", null);
__decorate([
    (0, decorators_1.Auth)([enums_1.ROLE.USER]),
    (0, common_1.Get)(),
    __param(0, (0, decorators_1.User)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, list_orders_query_dto_1.ListOrdersQueryDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "listOrders", null);
__decorate([
    (0, decorators_1.Auth)([enums_1.ROLE.USER]),
    (0, common_1.Get)('/:id'),
    __param(0, (0, decorators_1.User)()),
    __param(1, (0, common_1.Param)('id', pipes_1.ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getOrder", null);
__decorate([
    (0, decorators_1.Auth)([enums_1.ROLE.USER]),
    (0, common_1.Patch)('/:id/cancel'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, decorators_1.User)()),
    __param(1, (0, common_1.Param)('id', pipes_1.ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "cancelOrder", null);
__decorate([
    (0, common_1.Post)('/webhook'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "orderWebhook", null);
exports.CustomerController = CustomerController = __decorate([
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [customer_service_1.CustomerService])
], CustomerController);
//# sourceMappingURL=customer.controller.js.map