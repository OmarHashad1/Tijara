"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const common_1 = require("@nestjs/common");
exports.User = (0, common_1.createParamDecorator)((_data, ctx) => {
    let user;
    switch (ctx.getType()) {
        case 'http': {
            user = ctx.switchToHttp().getRequest().credentials.user;
            break;
        }
        case 'ws':
        case 'rpc':
        default:
            throw new common_1.BadRequestException('Invalid or unsupported protocol');
    }
    return user;
});
//# sourceMappingURL=user.decorator.js.map