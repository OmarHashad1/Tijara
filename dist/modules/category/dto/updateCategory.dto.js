"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCategoryInput = exports.UpdateCategoryDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const graphql_1 = require("@nestjs/graphql");
const createCategory_dto_1 = require("./createCategory.dto");
class UpdateCategoryDto extends (0, mapped_types_1.PartialType)(createCategory_dto_1.CreateCategoryDto) {
}
exports.UpdateCategoryDto = UpdateCategoryDto;
let UpdateCategoryInput = class UpdateCategoryInput extends (0, graphql_1.PartialType)(createCategory_dto_1.CreateCategoryInput) {
};
exports.UpdateCategoryInput = UpdateCategoryInput;
exports.UpdateCategoryInput = UpdateCategoryInput = __decorate([
    (0, graphql_1.InputType)()
], UpdateCategoryInput);
//# sourceMappingURL=updateCategory.dto.js.map