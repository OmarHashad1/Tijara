"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOKEN_TYPE = exports.ROLE = void 0;
var ROLE;
(function (ROLE) {
    ROLE["USER"] = "user";
    ROLE["COMPANY"] = "company";
    ROLE["ADMIN"] = "admin";
})(ROLE || (exports.ROLE = ROLE = {}));
var TOKEN_TYPE;
(function (TOKEN_TYPE) {
    TOKEN_TYPE["ACCESS"] = "access";
    TOKEN_TYPE["REFRESH"] = "refresh";
})(TOKEN_TYPE || (exports.TOKEN_TYPE = TOKEN_TYPE = {}));
//# sourceMappingURL=auth.enum.js.map