"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envSchema = void 0;
const zod_1 = require("zod");
exports.envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z
        .enum(['development', 'production', 'test'])
        .default('development'),
    PORT: zod_1.z.coerce.number().int().positive().default(3000),
    APPLICATION_NAME: zod_1.z.string().min(1),
    MONGODB_URI: zod_1.z.url(),
    SMTP_USER: zod_1.z.email(),
    SMTP_PASS: zod_1.z.string().min(1),
    SMTP_PORT: zod_1.z.coerce.number().int().positive(),
    SMTP_SERVICE: zod_1.z.string().min(1),
    ENCRYPTION_SECRET: zod_1.z.string().min(1),
    ENCRYPTION_IV_LENGTH: zod_1.z.coerce.number().int().positive(),
    ENCRYPTION_ALGORITHM: zod_1.z.string().min(1),
    REDIS_URL: zod_1.z.url(),
    USER_ACCESS_SECRET: zod_1.z.string().min(1),
    USER_REFRESH_SECRET: zod_1.z.string().min(1),
    ADMIN_ACCESS_SECRET: zod_1.z.string().min(1),
    ADMIN_REFRESH_SECRET: zod_1.z.string().min(1),
    COMPANY_ACCESS_SECRET: zod_1.z.string().min(1),
    COMPANY_REFRESH_SECRET: zod_1.z.string().min(1),
    CLIENT_URL: zod_1.z.url(),
    GOOGLE_CLIENT_ID: zod_1.z.string().min(1),
    GOOGLE_CLIENT_SECRET: zod_1.z.string().min(1),
    GOOGLE_CALLBACK_URL: zod_1.z.url(),
    AWS_REGION: zod_1.z.string().min(1),
    AWS_ACCESS_KEY_ID: zod_1.z.string().min(1),
    AWS_SECRET_ACCESS_KEY: zod_1.z.string().min(1),
    AWS_EXPIRATION: zod_1.z.coerce.number().int().positive(),
    AWS_BUCKET_NAME: zod_1.z.string().min(1),
    STRIPE_SECRET_KEY: zod_1.z.string().min(1),
    STRIPE_HOOK_SECRET: zod_1.z.string().min(1),
});
//# sourceMappingURL=env.schema.js.map