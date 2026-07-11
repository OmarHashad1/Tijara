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
exports.PaginatedProducts = exports.ProductListMeta = exports.ProductEntity = void 0;
const graphql_1 = require("@nestjs/graphql");
let ProductEntity = class ProductEntity {
    id;
    name;
    slug;
    description;
    price;
    discountPercent;
    categoryId;
    brandId;
    images;
};
exports.ProductEntity = ProductEntity;
__decorate([
    (0, graphql_1.Field)((type) => String),
    __metadata("design:type", String)
], ProductEntity.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)((type) => String),
    __metadata("design:type", String)
], ProductEntity.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)((type) => String),
    __metadata("design:type", String)
], ProductEntity.prototype, "slug", void 0);
__decorate([
    (0, graphql_1.Field)((type) => String),
    __metadata("design:type", String)
], ProductEntity.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)((type) => graphql_1.Float),
    __metadata("design:type", Number)
], ProductEntity.prototype, "price", void 0);
__decorate([
    (0, graphql_1.Field)((type) => graphql_1.Int),
    __metadata("design:type", Number)
], ProductEntity.prototype, "discountPercent", void 0);
__decorate([
    (0, graphql_1.Field)((type) => String),
    __metadata("design:type", String)
], ProductEntity.prototype, "categoryId", void 0);
__decorate([
    (0, graphql_1.Field)((type) => String),
    __metadata("design:type", String)
], ProductEntity.prototype, "brandId", void 0);
__decorate([
    (0, graphql_1.Field)((type) => [String]),
    __metadata("design:type", Array)
], ProductEntity.prototype, "images", void 0);
exports.ProductEntity = ProductEntity = __decorate([
    (0, graphql_1.ObjectType)()
], ProductEntity);
let ProductListMeta = class ProductListMeta {
    count;
    page;
    size;
    pages;
};
exports.ProductListMeta = ProductListMeta;
__decorate([
    (0, graphql_1.Field)((type) => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], ProductListMeta.prototype, "count", void 0);
__decorate([
    (0, graphql_1.Field)((type) => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], ProductListMeta.prototype, "page", void 0);
__decorate([
    (0, graphql_1.Field)((type) => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], ProductListMeta.prototype, "size", void 0);
__decorate([
    (0, graphql_1.Field)((type) => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], ProductListMeta.prototype, "pages", void 0);
exports.ProductListMeta = ProductListMeta = __decorate([
    (0, graphql_1.ObjectType)()
], ProductListMeta);
let PaginatedProducts = class PaginatedProducts {
    docs;
    meta;
};
exports.PaginatedProducts = PaginatedProducts;
__decorate([
    (0, graphql_1.Field)((type) => [ProductEntity]),
    __metadata("design:type", Array)
], PaginatedProducts.prototype, "docs", void 0);
__decorate([
    (0, graphql_1.Field)((type) => ProductListMeta),
    __metadata("design:type", ProductListMeta)
], PaginatedProducts.prototype, "meta", void 0);
exports.PaginatedProducts = PaginatedProducts = __decorate([
    (0, graphql_1.ObjectType)()
], PaginatedProducts);
//# sourceMappingURL=product.entity.js.map