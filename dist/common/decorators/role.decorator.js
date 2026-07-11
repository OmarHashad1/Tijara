"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = exports.allowedRoleName = void 0;
const common_1 = require("@nestjs/common");
exports.allowedRoleName = 'allowedRoles';
const Role = (roles) => {
    return (0, common_1.SetMetadata)(exports.allowedRoleName, roles);
};
exports.Role = Role;
//# sourceMappingURL=role.decorator.js.map