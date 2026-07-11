"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const configs_1 = require("./configs");
const common_1 = require("@nestjs/common");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const interceptors_1 = require("./common/interceptors");
const express_1 = require("express");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        credential: true,
        origin: configs_1.CLIENT_URL,
    });
    app.use('/orders/webhook', (0, express_1.raw)({ type: 'application/json' }));
    app.getHttpAdapter().get('/health', (_req, res) => {
        res.status(200).json({ message: 'ok' });
    });
    app.useGlobalInterceptors(new interceptors_1.TimeoutInterceptor(), new interceptors_1.ResponseInterceptor());
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
    }));
    app.use((0, cookie_parser_1.default)());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    await app.listen(configs_1.PORT);
}
bootstrap();
//# sourceMappingURL=main.js.map