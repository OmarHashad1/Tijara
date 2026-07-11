import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RedisService } from '../services/redis';
import { Reflector } from '@nestjs/core';
export declare class RedisCacheInterceptor implements NestInterceptor {
    private readonly redisService;
    private readonly refelector;
    constructor(redisService: RedisService, refelector: Reflector);
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>>;
}
