"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REFRESH_COOKIE_OPTION = exports.ACCESS_COOKIE_OPTION = void 0;
exports.ACCESS_COOKIE_OPTION = {
    maxAge: 30 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
};
exports.REFRESH_COOKIE_OPTION = {
    maxAge: 60 * 60 * 24 * 7 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
};
//# sourceMappingURL=cookie.config.js.map