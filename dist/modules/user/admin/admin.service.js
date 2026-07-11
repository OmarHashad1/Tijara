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
const repositories_1 = require("../../../common/repositories");
const enums_1 = require("../../../common/enums");
const email_enums_1 = require("../../../common/enums/email.enums");
const email_event_1 = require("../../../common/events/email.event");
let AdminService = class AdminService {
    userRepo;
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async listUsers(query) {
        const { search, status, role, page = 1, size = 20 } = query;
        const filter = {};
        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }
        if (status)
            filter.status = status;
        if (role)
            filter.role = role;
        return this.userRepo.paginate({ filter, options: {}, page, size });
    }
    async getUser(id) {
        const user = await this.userRepo.findOne({
            filter: { _id: id },
            options: { lean: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async banUser(id, dto) {
        const user = await this.userRepo.findOne({
            filter: { _id: id },
            options: { lean: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (!enums_1.USER_STATUS_TRANSITIONS.ban.includes(user.status)) {
            throw new common_1.BadRequestException('User is already banned');
        }
        await this.userRepo.updateOne({
            filter: { _id: id },
            update: {
                $set: { status: enums_1.USER_STATUS.BANNED, banReason: dto.banReason },
            },
        });
        email_event_1.emailEmitter.emit(email_enums_1.EMAIL_EVENTS.USER_BANNED, {
            to: user.email,
            firstName: user.firstName,
            reason: dto.banReason,
        });
    }
    async unbanUser(id) {
        const user = await this.userRepo.findOne({
            filter: { _id: id },
            options: { lean: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (!enums_1.USER_STATUS_TRANSITIONS.unban.includes(user.status)) {
            throw new common_1.BadRequestException('User is not banned');
        }
        await this.userRepo.updateOne({
            filter: { _id: id },
            update: { $set: { status: enums_1.USER_STATUS.ACTIVE, banReason: null } },
        });
        email_event_1.emailEmitter.emit(email_enums_1.EMAIL_EVENTS.USER_UNBANNED, {
            to: user.email,
            firstName: user.firstName,
        });
    }
    async softDeleteUser(id) {
        const now = new Date();
        const result = await this.userRepo.updateOne({
            filter: { _id: id, deletedAt: null },
            update: { $set: { deletedAt: now, credentialsChangedAt: now } },
        });
        if (!result.matchedCount)
            throw new common_1.NotFoundException('User not found or already deleted');
    }
    async hardDeleteUser(id) {
        const result = await this.userRepo.deleteOne({ filter: { _id: id } });
        if (!result.deletedCount)
            throw new common_1.NotFoundException('User not found');
    }
    async restoreUser(id) {
        const result = await this.userRepo.updateOne({
            filter: { _id: id, deletedAt: { $ne: null } },
            update: { $set: { deletedAt: null, restoredAt: new Date() } },
        });
        if (!result.matchedCount)
            throw new common_1.NotFoundException('User not found or not deleted');
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [repositories_1.UserRepo])
], AdminService);
//# sourceMappingURL=admin.service.js.map