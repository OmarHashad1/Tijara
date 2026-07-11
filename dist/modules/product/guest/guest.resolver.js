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
const product_entity_1 = require("./../entities/product.entity");
const guest_service_1 = require("./guest.service");
const graphql_1 = require("@nestjs/graphql");
const graphql_2 = require("@nestjs/graphql");
const product_entity_2 = require("../entities/product.entity");
const listProductsQuery_dto_1 = require("../dto/listProductsQuery.dto");
const common_1 = require("@nestjs/common");
const decorators_1 = require("../../../common/decorators");
const enums_1 = require("../../../common/enums");
const interceptors_1 = require("../../../common/interceptors");
let GuestResolver = class GuestResolver {
    guestService;
    constructor(guestService) {
        this.guestService = guestService;
    }
    async listProducts(query) {
        return await this.guestService.listProducts(query);
    }
    getProduct(slug) {
        return this.guestService.getSingleProduct({ slug });
    }
};
exports.GuestResolver = GuestResolver;
__decorate([
    (0, common_1.UseInterceptors)(interceptors_1.RedisCacheInterceptor),
    (0, decorators_1.Auth)([enums_1.ROLE.USER]),
    (0, graphql_1.Query)((returns) => product_entity_2.PaginatedProducts),
    __param(0, (0, graphql_1.Args)('query', { type: () => listProductsQuery_dto_1.ListProductQueryInput, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [listProductsQuery_dto_1.ListProductQueryInput]),
    __metadata("design:returntype", Promise)
], GuestResolver.prototype, "listProducts", null);
__decorate([
    (0, graphql_1.Query)((returns) => product_entity_1.ProductEntity),
    __param(0, (0, graphql_1.Args)('slug', { type: () => String })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GuestResolver.prototype, "getProduct", null);
exports.GuestResolver = GuestResolver = __decorate([
    (0, graphql_2.Resolver)(),
    __metadata("design:paramtypes", [guest_service_1.GuestService])
], GuestResolver);
//# sourceMappingURL=guest.resolver.js.map