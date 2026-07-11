"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuestModule = void 0;
const common_1 = require("@nestjs/common");
const category_module_1 = require("../category.module");
const guest_controller_1 = require("./guest.controller");
const guest_service_1 = require("./guest.service");
const guest_resolver_1 = require("./guest.resolver");
const brand_module_1 = require("../../brand/brand.module");
let GuestModule = class GuestModule {
};
exports.GuestModule = GuestModule;
exports.GuestModule = GuestModule = __decorate([
    (0, common_1.Module)({
        imports: [category_module_1.CategoryModule, brand_module_1.BrandModule],
        controllers: [guest_controller_1.GuestController],
        providers: [guest_service_1.GuestService, guest_resolver_1.GuestResolver],
    })
], GuestModule);
//# sourceMappingURL=guest.module.js.map