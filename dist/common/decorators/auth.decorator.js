"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const common_1 = require("@nestjs/common");
const role_decorator_1 = require("./role.decorator");
const token_decorator_1 = require("./token.decorator");
const auth_enum_1 = require("../enums/auth.enum");
const authentication_guard_1 = require("../guards/auth/authentication.guard");
const authorization_guard_1 = require("../guards/auth/authorization.guard");
const email_verified_guard_1 = require("../guards/email-verified.guard");
const Auth = (roles, tokenTypeVal = auth_enum_1.TOKEN_TYPE.ACCESS) => {
    return (0, common_1.applyDecorators)((0, token_decorator_1.Token)(tokenTypeVal), (0, role_decorator_1.Role)(roles), (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, authorization_guard_1.AuthorizationGuard, email_verified_guard_1.EmailVerifiedGuard));
};
exports.Auth = Auth;
//# sourceMappingURL=auth.decorator.js.map