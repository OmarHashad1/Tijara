"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./modules/auth/auth.module");
const requestPublicFile_middleware_1 = require("./common/middlewares/requestPublicFile.middleware");
const config_1 = require("@nestjs/config");
const database_1 = require("./core/database");
const services_1 = require("./common/services");
const env_utils_1 = require("./common/utils/env.utils");
const token_config_1 = __importDefault(require("./configs/token.config"));
const customer_module_1 = require("./modules/user/customer/customer.module");
const admin_module_1 = require("./modules/user/admin/admin.module");
const admin_module_2 = require("./modules/category/admin/admin.module");
const guest_module_1 = require("./modules/category/guest/guest.module");
const admin_module_3 = require("./modules/brand/admin/admin.module");
const guest_module_2 = require("./modules/brand/guest/guest.module");
const admin_module_4 = require("./modules/product/admin/admin.module");
const guest_module_3 = require("./modules/product/guest/guest.module");
const customer_module_2 = require("./modules/cart/customer/customer.module");
const customer_module_3 = require("./modules/wishlist/customer/customer.module");
const customer_module_4 = require("./modules/order/customer/customer.module");
const admin_module_5 = require("./modules/order/admin/admin.module");
const customer_module_5 = require("./modules/coupon/customer/customer.module");
const admin_module_6 = require("./modules/coupon/admin/admin.module");
const guest_module_4 = require("./modules/review/guest/guest.module");
const customer_module_6 = require("./modules/review/customer/customer.module");
const admin_module_7 = require("./modules/review/admin/admin.module");
const cache_manager_1 = require("@nestjs/cache-manager");
const graphql_1 = require("@nestjs/graphql");
const apollo_1 = require("@nestjs/apollo");
const path_1 = require("path");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(requestPublicFile_middleware_1.RequestPublicFile).forRoutes('public/*path');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env.development', '.env.production'],
                validate: env_utils_1.validateEnv,
                load: [token_config_1.default],
            }),
            cache_manager_1.CacheModule.register({ isGlobal: true, ttl: 10000 }),
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloDriver,
                graphiql: true,
                autoSchemaFile: (0, path_1.join)(process.cwd(), 'src/schema.gql'),
                playground: false,
            }),
            services_1.CommonModule,
            auth_module_1.AuthModule,
            database_1.DatabaseModule,
            customer_module_1.CustomerModule,
            admin_module_1.AdminModule,
            admin_module_2.AdminModule,
            guest_module_1.GuestModule,
            admin_module_3.AdminModule,
            guest_module_2.GuestModule,
            admin_module_4.AdminModule,
            guest_module_3.GuestModule,
            customer_module_2.CustomerModule,
            customer_module_3.CustomerModule,
            customer_module_4.CustomerModule,
            admin_module_5.AdminModule,
            customer_module_5.CustomerModule,
            admin_module_6.AdminModule,
            guest_module_4.GuestModule,
            customer_module_6.CustomerModule,
            admin_module_7.AdminModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map