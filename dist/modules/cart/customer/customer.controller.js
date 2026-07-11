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
const add_cart_item_dto_1 = require("../dto/add-cart-item.dto");
const update_cart_item_dto_1 = require("../dto/update-cart-item.dto");
const customer_service_1 = require("./customer.service");
let CustomerController = class CustomerController {
    customerService;
    constructor(customerService) {
        this.customerService = customerService;
    }
    async getCart(user) {
        const payload = await this.customerService.getCart(user._id);
        return { message: 'Cart fetched successfully', payload };
    }
    async addItem(user, dto) {
        const payload = await this.customerService.addItem(user._id, dto);
        return { message: 'Item added to cart successfully', payload };
    }
    async updateItemQuantity(user, productId, dto) {
        const payload = await this.customerService.updateItemQuantity(user._id, productId, dto);
        return { message: 'Cart item updated successfully', payload };
    }
    async removeItem(user, productId) {
        const payload = await this.customerService.removeItem(user._id, productId);
        return { message: 'Item removed from cart successfully', payload };
    }
    async clearCart(user) {
        await this.customerService.clearCart(user._id);
        return { message: 'Cart cleared successfully' };
    }
};
exports.CustomerController = CustomerController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, decorators_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "getCart", null);
__decorate([
    (0, common_1.Post)('/items'),
    __param(0, (0, decorators_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, add_cart_item_dto_1.AddCartItemDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "addItem", null);
__decorate([
    (0, common_1.Patch)('/items/:productId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, decorators_1.User)()),
    __param(1, (0, common_1.Param)('productId', pipes_1.ParseObjectIdPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, mongoose_1.Types.ObjectId, update_cart_item_dto_1.UpdateCartItemDto]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "updateItemQuantity", null);
__decorate([
    (0, common_1.Delete)('/items/:productId'),
    __param(0, (0, decorators_1.User)()),
    __param(1, (0, common_1.Param)('productId', pipes_1.ParseObjectIdPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "removeItem", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, decorators_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomerController.prototype, "clearCart", null);
exports.CustomerController = CustomerController = __decorate([
    (0, common_1.Controller)('cart'),
    (0, decorators_1.Auth)([enums_1.ROLE.USER]),
    __metadata("design:paramtypes", [customer_service_1.CustomerService])
], CustomerController);
//# sourceMappingURL=customer.controller.js.map