import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenService } from "../../services/token";
import { UserRepo } from "../../repositories";
import { RedisService } from "../../services/redis";
export declare class AuthenticationGuard implements CanActivate {
    private readonly tokenService;
    private readonly userRepo;
    private readonly reflector;
    private readonly redisService;
    constructor(tokenService: TokenService, userRepo: UserRepo, reflector: Reflector, redisService: RedisService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
