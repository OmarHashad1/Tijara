"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkipEmailVerification = exports.skipEmailVerificationName = exports.SkipEmailVerificationDecorator = void 0;
class SkipEmailVerificationDecorator {
}
exports.SkipEmailVerificationDecorator = SkipEmailVerificationDecorator;
const common_1 = require("@nestjs/common");
exports.skipEmailVerificationName = 'skipEmailVerification';
const SkipEmailVerification = () => {
    return (0, common_1.SetMetadata)(exports.skipEmailVerificationName, true);
};
exports.SkipEmailVerification = SkipEmailVerification;
//# sourceMappingURL=skipEmailverification.decorator.js.map