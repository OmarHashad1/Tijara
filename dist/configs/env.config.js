"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AWS_BUCKET_NAME = exports.AWS_EXPIRATION = exports.AWS_SECRET_ACCESS_KEY = exports.AWS_ACCESS_KEY_ID = exports.AWS_REGION = exports.GOOGLE_CALLBACK_URL = exports.GOOGLE_CLIENT_SECRET = exports.GOOGLE_CLIENT_ID = exports.CLIENT_URL = exports.COMPANY_REFRESH_SECRET = exports.COMPANY_ACCESS_SECRET = exports.ADMIN_REFRESH_SECRET = exports.ADMIN_ACCESS_SECRET = exports.USER_REFRESH_SECRET = exports.USER_ACCESS_SECRET = exports.REDIS_URL = exports.ENCRYPTION_ALGORITHM = exports.ENCRYPTION_IV_LENGTH = exports.ENCRYPTION_SECRET = exports.SMTP_SERVICE = exports.SMTP_PORT = exports.SMTP_PASS = exports.SMTP_USER = exports.MONGODB_URI = exports.PORT = exports.APPLICATION_NAME = void 0;
exports.APPLICATION_NAME = process.env.APPLICATION_NAME;
exports.PORT = process.env.PORT;
exports.MONGODB_URI = process.env.MONGODB_URI;
exports.SMTP_USER = process.env.SMTP_USER;
exports.SMTP_PASS = process.env.SMTP_PASS;
exports.SMTP_PORT = process.env.SMTP_PORT;
exports.SMTP_SERVICE = process.env.SMTP_SERVICE;
exports.ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET;
exports.ENCRYPTION_IV_LENGTH = Number(process.env.ENCRYPTION_IV_LENGTH);
exports.ENCRYPTION_ALGORITHM = process.env.ENCRYPTION_ALGORITHM;
exports.REDIS_URL = process.env.REDIS_URL;
exports.USER_ACCESS_SECRET = process.env.USER_ACCESS_SECRET;
exports.USER_REFRESH_SECRET = process.env.USER_REFRESH_SECRET;
exports.ADMIN_ACCESS_SECRET = process.env.ADMIN_ACCESS_SECRET;
exports.ADMIN_REFRESH_SECRET = process.env.ADMIN_REFRESH_SECRET;
exports.COMPANY_ACCESS_SECRET = process.env
    .COMPANY_ACCESS_SECRET;
exports.COMPANY_REFRESH_SECRET = process.env
    .COMPANY_REFRESH_SECRET;
exports.CLIENT_URL = process.env.CLIENT_URL;
exports.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
exports.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
exports.GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;
exports.AWS_REGION = process.env.AWS_REGION;
exports.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
exports.AWS_SECRET_ACCESS_KEY = process.env
    .AWS_SECRET_ACCESS_KEY;
exports.AWS_EXPIRATION = process.env.AWS_EXPIRATION;
exports.AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
//# sourceMappingURL=env.config.js.map