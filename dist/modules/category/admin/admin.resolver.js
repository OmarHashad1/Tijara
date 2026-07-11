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
exports.AdminResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const mongoose_1 = require("mongoose");
const decorators_1 = require("../../../common/decorators");
const enums_1 = require("../../../common/enums");
const admin_service_1 = require("./admin.service");
const category_entity_1 = require("../entities/category.entity");
const createCategory_dto_1 = require("../dto/createCategory.dto");
const updateCategory_dto_1 = require("../dto/updateCategory.dto");
let AdminResolver = class AdminResolver {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    async createCategory(input) {
        return this.adminService.createCategory(input);
    }
    async updateCategory(id, input) {
        return this.adminService.updateCategory(new mongoose_1.Types.ObjectId(id), input);
    }
    async deleteCategory(id) {
        await this.adminService.deleteCategory(new mongoose_1.Types.ObjectId(id));
        return true;
    }
};
exports.AdminResolver = AdminResolver;
__decorate([
    (0, decorators_1.Auth)([enums_1.ROLE.ADMIN]),
    (0, graphql_1.Mutation)((returns) => category_entity_1.CategoryEntity),
    __param(0, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createCategory_dto_1.CreateCategoryInput]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "createCategory", null);
__decorate([
    (0, decorators_1.Auth)([enums_1.ROLE.ADMIN]),
    (0, graphql_1.Mutation)((returns) => category_entity_1.CategoryEntity),
    __param(0, (0, graphql_1.Args)('id', { type: () => String })),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, updateCategory_dto_1.UpdateCategoryInput]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "updateCategory", null);
__decorate([
    (0, decorators_1.Auth)([enums_1.ROLE.ADMIN]),
    (0, graphql_1.Mutation)((returns) => Boolean),
    __param(0, (0, graphql_1.Args)('id', { type: () => String })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "deleteCategory", null);
exports.AdminResolver = AdminResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminResolver);
//# sourceMappingURL=admin.resolver.js.map