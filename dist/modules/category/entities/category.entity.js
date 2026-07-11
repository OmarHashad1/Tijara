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
exports.CategoryWithBrands = exports.CategoryEntity = void 0;
const graphql_1 = require("@nestjs/graphql");
const enums_1 = require("../../../common/enums");
const brand_entity_1 = require("../../brand/entities/brand.entity");
(0, graphql_1.registerEnumType)(enums_1.CATEGORY_STATUS, { name: 'CATEGORY_STATUS' });
let CategoryEntity = class CategoryEntity {
    id;
    name;
    slug;
    status;
};
exports.CategoryEntity = CategoryEntity;
__decorate([
    (0, graphql_1.Field)((type) => String),
    __metadata("design:type", String)
], CategoryEntity.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)((type) => String),
    __metadata("design:type", String)
], CategoryEntity.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)((type) => String, { nullable: true }),
    __metadata("design:type", String)
], CategoryEntity.prototype, "slug", void 0);
__decorate([
    (0, graphql_1.Field)((type) => enums_1.CATEGORY_STATUS, { nullable: true }),
    __metadata("design:type", String)
], CategoryEntity.prototype, "status", void 0);
exports.CategoryEntity = CategoryEntity = __decorate([
    (0, graphql_1.ObjectType)()
], CategoryEntity);
let CategoryWithBrands = class CategoryWithBrands extends CategoryEntity {
    brands;
};
exports.CategoryWithBrands = CategoryWithBrands;
__decorate([
    (0, graphql_1.Field)((type) => [brand_entity_1.BrandEntity]),
    __metadata("design:type", Array)
], CategoryWithBrands.prototype, "brands", void 0);
exports.CategoryWithBrands = CategoryWithBrands = __decorate([
    (0, graphql_1.ObjectType)()
], CategoryWithBrands);
//# sourceMappingURL=category.entity.js.map