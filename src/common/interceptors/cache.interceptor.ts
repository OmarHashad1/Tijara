import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, of, throwError, TimeoutError } from 'rxjs';
import { tap, timeout } from 'rxjs/operators';
import { RedisService } from '../services/redis';
import { Reflector } from '@nestjs/core';
import { UserDocument } from 'src/models';
import { personalCacheName } from '../decorators/personalCach.decorator';

@Injectable()
export class RedisCacheInterceptor implements NestInterceptor {
  constructor(
    private readonly redisService: RedisService,
    private readonly refelector: Reflector,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    let url = '';
    const ttl =
      this.refelector.getAllAndOverride('ttlVal', [
        context.getHandler(),
        context.getClass(),
      ]) ?? 10;
    const isPersonalCache = this.refelector.getAllAndOverride(
      personalCacheName,
      [context.getClass(), context.getHandler()],
    );

    let user: UserDocument | null = null;

    switch (context.getType()) {
      case 'http':
        url = context.switchToHttp().getRequest().url;
        user = context.switchToHttp().getRequest().credentails.user;
      case 'ws':
        break;
      case 'rpc':
        break;

      default:
        throw new BadRequestException('Invalid protocol');
    }

    if (!user)
      throw new UnauthorizedException('Invalid session, please login again');

    const cachedKey = this.redisService.CahcedKey(
      url,
      isPersonalCache ? user._id.toString() : null,
    );
    const data = await this.redisService.get(cachedKey);
    if (data) {
      return of(data);
    }
    return next.handle().pipe(
      tap(async (value: string) => {
        await this.redisService.set({ key: cachedKey, value, ttl });
      }),
    );
  }
}
