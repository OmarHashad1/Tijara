"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const admin_resolver_1 = require("./admin.resolver");
const category_module_1 = require("../category.module");
const user_module_1 = require("../../user/user.module");
const brand_module_1 = require("../../brand/brand.module");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [category_module_1.CategoryModule, user_module_1.UserModule, brand_module_1.BrandModule],
        exports: [],
        providers: [admin_service_1.AdminService, admin_resolver_1.AdminResolver],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map