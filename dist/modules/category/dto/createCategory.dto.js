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
exports.CreateCategoryInput = exports.CreateCategoryDto = void 0;
const class_validator_1 = require("class-validator");
const graphql_1 = require("@nestjs/graphql");
const enums_1 = require("../../../common/enums");
class CreateCategoryDto {
    name;
    status = enums_1.CATEGORY_STATUS.PUBLISHED;
}
exports.CreateCategoryDto = CreateCategoryDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(64),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.CATEGORY_STATUS),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "status", void 0);
let CreateCategoryInput = class CreateCategoryInput {
    name;
    status = enums_1.CATEGORY_STATUS.PUBLISHED;
};
exports.CreateCategoryInput = CreateCategoryInput;
__decorate([
    (0, graphql_1.Field)((type) => String),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(64),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], CreateCategoryInput.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)((type) => enums_1.CATEGORY_STATUS, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.CATEGORY_STATUS),
    __metadata("design:type", String)
], CreateCategoryInput.prototype, "status", void 0);
exports.CreateCategoryInput = CreateCategoryInput = __decorate([
    (0, graphql_1.InputType)()
], CreateCategoryInput);
//# sourceMappingURL=createCategory.dto.js.map