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
exports.AuthorizationGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const graphql_1 = require("@nestjs/graphql");
let AuthorizationGuard = class AuthorizationGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const allowedRoles = this.reflector.getAllAndOverride('allowedRoles', [context.getHandler(), context.getClass()]);
        if (!allowedRoles)
            throw new common_1.InternalServerErrorException('Allowed roles must be provided');
        let user;
        switch (context.getType()) {
            case 'http': {
                const req = context.switchToHttp().getRequest();
                user = req.credentials.user;
                break;
            }
            case 'graphql': {
                const req = graphql_1.GqlExecutionContext.create(context).getContext().req;
                user = req.credentials.user;
                break;
            }
            default:
                throw new common_1.BadRequestException('Invalid or unsupported protocol');
        }
        if (!allowedRoles.includes(user.role)) {
            throw new common_1.ForbiddenException('You do not have access to this resource');
        }
        return true;
    }
};
exports.AuthorizationGuard = AuthorizationGuard;
exports.AuthorizationGuard = AuthorizationGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], AuthorizationGuard);
//# sourceMappingURL=authorization.guard.js.map