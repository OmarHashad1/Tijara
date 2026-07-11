"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYMENT_METHOD = exports.USER_STATUS_TRANSITIONS = exports.USER_STATUS = exports.ROLE = void 0;
var ROLE;
(function (ROLE) {
    ROLE["USER"] = "user";
    ROLE["ADMIN"] = "admin";
})(ROLE || (exports.ROLE = ROLE = {}));
var USER_STATUS;
(function (USER_STATUS) {
    USER_STATUS["ACTIVE"] = "active";
    USER_STATUS["DEACTIVATED"] = "deativated";
    USER_STATUS["BANNED"] = "BANNED";
})(USER_STATUS || (exports.USER_STATUS = USER_STATUS = {}));
exports.USER_STATUS_TRANSITIONS = {
    ban: [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVATED],
    unban: [USER_STATUS.BANNED],
};
var PAYMENT_METHOD;
(function (PAYMENT_METHOD) {
    PAYMENT_METHOD["CARD"] = "card";
    PAYMENT_METHOD["POD"] = "POD";
})(PAYMENT_METHOD || (exports.PAYMENT_METHOD = PAYMENT_METHOD = {}));
//# sourceMappingURL=user.enum.js.map