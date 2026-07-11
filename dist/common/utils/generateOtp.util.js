"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = void 0;
const nanoid_1 = require("nanoid");
const generateOTP = async () => {
    const otp = (0, nanoid_1.customAlphabet)('0123456789', 6)();
    console.log(otp);
    return otp;
};
exports.generateOTP = generateOTP;
//# sourceMappingURL=generateOtp.util.js.map