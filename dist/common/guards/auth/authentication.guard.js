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
exports.AuthenticationGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const token_1 = require("../../services/token");
const enums_1 = require("../../enums");
const auth_enum_1 = require("../../enums/auth.enum");
const repositories_1 = require("../../repositories");
const redis_1 = require("../../services/redis");
const graphql_1 = require("@nestjs/graphql");
let AuthenticationGuard = class AuthenticationGuard {
    tokenService;
    userRepo;
    reflector;
    redisService;
    constructor(tokenService, userRepo, reflector, redisService) {
        this.tokenService = tokenService;
        this.userRepo = userRepo;
        this.reflector = reflector;
        this.redisService = redisService;
    }
    async canActivate(context) {
        let req;
        let token = null;
        const type = this.reflector.getAllAndOverride('tokenType', [
            context.getHandler(),
            context.getClass(),
        ]) ?? 'access';
        switch (context.getType()) {
            case 'http': {
                req = context.switchToHttp().getRequest();
                token =
                    type == auth_enum_1.TOKEN_TYPE.ACCESS
                        ? req.cookies.accessToken
                        : req.cookies.refreshToken;
                break;
            }
            case 'graphql': {
                req = graphql_1.GqlExecutionContext.create(context).getContext().req;
                token =
                    type === auth_enum_1.TOKEN_TYPE.ACCESS
                        ? req.cookies.accessToken
                        : req.cookies.refreshToken;
                break;
            }
            default:
                throw new common_1.BadRequestException('Invalid or unsupported protocol');
        }
        if (!token)
            return false;
        const decoded = await this.tokenService.decodeToken({
            token,
            type,
        });
        const user = await this.userRepo.findOne({
            filter: { _id: decoded._id },
            options: { lean: false, paranoId: false },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.deletedAt)
            throw new common_1.NotFoundException('User not found');
        if (user.credentialsChangedAt &&
            decoded.iat < user.credentialsChangedAt.getTime() / 1000) {
            throw new common_1.BadRequestException('Invalid session. Please login again');
        }
        if (await this.redisService.get(this.redisService.revokedTokenKey({
            jti: decoded.jti,
            userId: user._id,
        }))) {
            throw new common_1.BadRequestException('Invalid session. Please login again');
        }
        if (user.status === enums_1.USER_STATUS.BANNED)
            throw new common_1.ForbiddenException('Your account is banned. Please contact support');
        if (user.status === enums_1.USER_STATUS.DEACTIVATED)
            throw new common_1.BadRequestException('Your account is deactivated');
        req.credentials = { user, decoded };
        return true;
    }
};
exports.AuthenticationGuard = AuthenticationGuard;
exports.AuthenticationGuard = AuthenticationGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [token_1.TokenService,
        repositories_1.UserRepo,
        core_1.Reflector,
        redis_1.RedisService])
], AuthenticationGuard);
//# sourceMappingURL=authentication.guard.js.map