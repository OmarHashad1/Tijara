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
exports.GuestResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const guest_service_1 = require("./guest.service");
const category_entity_1 = require("../entities/category.entity");
let GuestResolver = class GuestResolver {
    guestService;
    constructor(guestService) {
        this.guestService = guestService;
    }
    async categories() {
        return this.guestService.listCategories();
    }
    async category(slug) {
        return this.guestService.getSingleCategory({ slug });
    }
};
exports.GuestResolver = GuestResolver;
__decorate([
    (0, graphql_1.Query)((returns) => [category_entity_1.CategoryEntity]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GuestResolver.prototype, "categories", null);
__decorate([
    (0, graphql_1.Query)((returns) => category_entity_1.CategoryWithBrands),
    __param(0, (0, graphql_1.Args)('slug', { type: () => String })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GuestResolver.prototype, "category", null);
exports.GuestResolver = GuestResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [guest_service_1.GuestService])
], GuestResolver);
//# sourceMappingURL=guest.resolver.js.map