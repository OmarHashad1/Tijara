"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TTL = void 0;
const common_1 = require("@nestjs/common");
const ttlName = 'ttlVal';
const TTL = (ttlValue) => {
    return (0, common_1.SetMetadata)(ttlName, ttlValue);
};
exports.TTL = TTL;
//# sourceMappingURL=ttl.decorator.js.map