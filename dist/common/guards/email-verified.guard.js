"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailVerifiedGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const graphql_1 = require("@nestjs/graphql");
const decorators_1 = require("../decorators");
let EmailVerifiedGuard = class EmailVerifiedGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const skip = this.reflector.getAllAndOverride(decorators_1.skipEmailVerificationName, [context.getHandler(), context.getClass()]);
        if (skip)
            return true;
        let req;
        switch (context.getType()) {
            case 'http': {
                req = context.switchToHttp().getRequest();
                break;
            }
            case 'graphql': {
                req = graphql_1.GqlExecutionContext.create(context).getContext().req;
                break;
            }
            default:
                throw new common_1.BadRequestException('Invalid or unsupported protocol');
        }
        if (!req.credentials?.user.isEmailVerified) {
            throw new common_1.ForbiddenException('Email verification required');
        }
        return true;
    }
};
exports.EmailVerifiedGuard = EmailVerifiedGuard;
exports.EmailVerifiedGuard = EmailVerifiedGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], EmailVerifiedGuard);
//# sourceMappingURL=email-verified.guard.js.map