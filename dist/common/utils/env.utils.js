"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = validateEnv;
const env_schema_1 = require("../schemas/env.schema");
function validateEnv(raw) {
    const result = env_schema_1.envSchema.safeParse(raw);
    if (!result.success) {
        const issues = result.error.issues
            .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
            .join('\n');
        throw new Error('Invalid environment variables', {
            cause: {
                issues,
            },
        });
    }
    return result.data;
}
//# sourceMappingURL=env.utils.js.map