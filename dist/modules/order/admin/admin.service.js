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
const order_repo_1 = require("../../../common/repositories/order.repo");
const product_repo_1 = require("../../../common/repositories/product.repo");
const repositories_1 = require("../../../common/repositories");
const enums_1 = require("../../../common/enums");
const email_enums_1 = require("../../../common/enums/email.enums");
const email_event_1 = require("../../../common/events/email.event");
let AdminService = class AdminService {
    orderRepo;
    productRepo;
    userRepo;
    constructor(orderRepo, productRepo, userRepo) {
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
        this.userRepo = userRepo;
    }
    async listOrders(query) {
        const { status, userId, page = 1, size = 20 } = query;
        const filter = {};
        if (status)
            filter.status = status;
        if (userId)
            filter.userId = new mongoose_1.Types.ObjectId(userId);
        return this.orderRepo.paginate({ filter, options: {}, page, size });
    }
    async getOrder(id) {
        const order = await this.orderRepo.findOne({
            filter: { _id: id },
            options: { lean: true },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    async updateStatus(id, dto) {
        const order = await this.orderRepo.findOne({
            filter: { _id: id },
            options: { lean: true },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        const allowedNextStatuses = enums_1.ORDER_STATUS_TRANSITIONS[order.status];
        if (!allowedNextStatuses.includes(dto.status))
            throw new common_1.BadRequestException(`Cannot transition order from "${order.status}" to "${dto.status}"`);
        const result = await this.orderRepo.updateOne({
            filter: { _id: id, status: order.status },
            update: { $set: { status: dto.status } },
        });
        if (!result.matchedCount)
            throw new common_1.BadRequestException('Order status changed concurrently, please retry');
        if (dto.status === enums_1.ORDER_STATUS.CANCELLED) {
            await Promise.all(order.items.map((item) => this.productRepo.updateOne({
                filter: { _id: item.productId },
                update: { $inc: { stock: item.quantity } },
            })));
        }
        const user = await this.userRepo.findOne({
            filter: { _id: order.userId },
            options: { lean: true },
        });
        if (user) {
            email_event_1.emailEmitter.emit(email_enums_1.EMAIL_EVENTS.ORDER_STATUS_UPDATED, {
                to: user.email,
                firstName: user.firstName,
                orderId: id.toString(),
                status: dto.status,
            });
        }
        return this.orderRepo.findOne({
            filter: { _id: id },
            options: { lean: true },
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [order_repo_1.OrderRepo,
        product_repo_1.ProductRepo,
        repositories_1.UserRepo])
], AdminService);
//# sourceMappingURL=admin.service.js.map