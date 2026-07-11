"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYMENT_PROVIDER = exports.PAYMENT_STATUS = void 0;
var PAYMENT_STATUS;
(function (PAYMENT_STATUS) {
    PAYMENT_STATUS["PENDING"] = "pending";
    PAYMENT_STATUS["COMPLETED"] = "completed";
    PAYMENT_STATUS["FAILED"] = "failed";
    PAYMENT_STATUS["REFUNDED"] = "refunded";
    PAYMENT_STATUS["CANCELLED"] = "cancelled";
})(PAYMENT_STATUS || (exports.PAYMENT_STATUS = PAYMENT_STATUS = {}));
var PAYMENT_PROVIDER;
(function (PAYMENT_PROVIDER) {
    PAYMENT_PROVIDER["STRIPE"] = "stripe";
    PAYMENT_PROVIDER["CASH_ON_DELIVERY"] = "cash_on_delivery";
})(PAYMENT_PROVIDER || (exports.PAYMENT_PROVIDER = PAYMENT_PROVIDER = {}));
//# sourceMappingURL=payment.enum.js.map