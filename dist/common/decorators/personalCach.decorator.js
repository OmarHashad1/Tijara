"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonalCache = exports.personalCacheName = void 0;
const common_1 = require("@nestjs/common");
exports.personalCacheName = 'personalCache';
const PersonalCache = (isPersonalCache = true) => {
    return (0, common_1.SetMetadata)(exports.personalCacheName, isPersonalCache);
};
exports.PersonalCache = PersonalCache;
//# sourceMappingURL=personalCach.decorator.js.map