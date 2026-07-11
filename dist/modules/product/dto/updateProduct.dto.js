"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const createProduct_dto_1 = require("./createProduct.dto");
class UpdateProductDto extends (0, mapped_types_1.PartialType)((0, mapped_types_1.OmitType)(createProduct_dto_1.CreateProductDto, ['stock'])) {
}
exports.UpdateProductDto = UpdateProductDto;
//# sourceMappingURL=updateProduct.dto.js.map