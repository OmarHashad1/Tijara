"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBrandDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const createBrand_dto_1 = require("./createBrand.dto");
class UpdateBrandDto extends (0, mapped_types_1.PartialType)(createBrand_dto_1.CreateBrandDto) {
}
exports.UpdateBrandDto = UpdateBrandDto;
//# sourceMappingURL=updateBrand.dto.js.map