"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = exports.tokenTypeName = void 0;
const common_1 = require("@nestjs/common");
const auth_enum_1 = require("../enums/auth.enum");
exports.tokenTypeName = 'tokenType';
const Token = (tokenTtypeVal = auth_enum_1.TOKEN_TYPE.ACCESS) => {
    return (0, common_1.SetMetadata)(exports.tokenTypeName, tokenTtypeVal);
};
exports.Token = Token;
//# sourceMappingURL=token.decorator.js.map