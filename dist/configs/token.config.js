"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('tokens', () => ({
    user: {
        access: process.env.USER_ACCESS_SECRET,
        refresh: process.env.USER_REFRESH_SECRET,
    },
    company: {
        access: process.env.COMPANY_ACCESS_SECRET,
        refresh: process.env.COMPANY_REFRESH_SECRET,
    },
    admin: {
        access: process.env.ADMIN_ACCESS_SECRET,
        refresh: process.env.ADMIN_REFRESH_SECRET,
    },
}));
//# sourceMappingURL=token.config.js.map