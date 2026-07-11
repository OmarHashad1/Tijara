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
exports.RedisCacheInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const redis_1 = require("../services/redis");
const core_1 = require("@nestjs/core");
const personalCach_decorator_1 = require("../decorators/personalCach.decorator");
const graphql_1 = require("@nestjs/graphql");
let RedisCacheInterceptor = class RedisCacheInterceptor {
    redisService;
    refelector;
    constructor(redisService, refelector) {
        this.redisService = redisService;
        this.refelector = refelector;
    }
    async intercept(context, next) {
        let url = '';
        const ttl = this.refelector.getAllAndOverride('ttlVal', [
            context.getHandler(),
            context.getClass(),
        ]) ?? 10;
        const isPersonalCache = this.refelector.getAllAndOverride(personalCach_decorator_1.personalCacheName, [context.getClass(), context.getHandler()]);
        let user = null;
        switch (context.getType()) {
            case 'http': {
                url = context.switchToHttp().getRequest().url;
                user = context.switchToHttp().getRequest().credentails?.user;
                break;
            }
            case 'graphql': {
                const ctx = graphql_1.GqlExecutionContext.create(context);
                url = JSON.stringify({
                    path: ctx.getInfo().path.key,
                    typename: ctx.getInfo().path.typename,
                    args: ctx.getArgs(),
                });
                user = ctx.getContext().req.credentials?.user;
                break;
            }
            default:
                throw new common_1.BadRequestException('Invalid or unsupported protocol');
        }
        if (isPersonalCache && !user)
            throw new common_1.UnauthorizedException('Invalid session, please login again');
        const cachedKey = this.redisService.CahcedKey(url, isPersonalCache && user ? user._id.toString() : null);
        const data = await this.redisService.get(cachedKey);
        if (data) {
            return (0, rxjs_1.of)(data);
        }
        return next.handle().pipe((0, operators_1.tap)(async (value) => {
            await this.redisService.set({ key: cachedKey, value, ttl });
        }));
    }
};
exports.RedisCacheInterceptor = RedisCacheInterceptor;
exports.RedisCacheInterceptor = RedisCacheInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_1.RedisService,
        core_1.Reflector])
], RedisCacheInterceptor);
//# sourceMappingURL=cache.interceptor.js.map