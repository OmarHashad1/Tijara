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
import { ctxType } from '../types';
import { GqlExecutionContext } from '@nestjs/graphql';

function parseIfJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

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

    switch (context.getType<ctxType>()) {
      case 'http': {
        url = context.switchToHttp().getRequest().url;
        user = context.switchToHttp().getRequest().credentails?.user;
        break;
      }
      case 'graphql': {
        const ctx = GqlExecutionContext.create(context);
        url = JSON.stringify({
          path: ctx.getInfo().path.key,
          typename: ctx.getInfo().path.typename,
          args: ctx.getArgs(),
        });
        user = ctx.getContext().req.credentials?.user;
        break;
      }
      default:
        throw new BadRequestException('Invalid or unsupported protocol');
    }

    if (isPersonalCache && !user)
      throw new UnauthorizedException('Invalid session, please login again');

    const cachedKey = this.redisService.CahcedKey(
      url,
      isPersonalCache && user ? user._id.toString() : null,
    );
    const cached = await this.redisService.get(cachedKey);
    if (cached) {
    
      return of(typeof cached === 'string' ? parseIfJson(cached) : cached);
    }

    return next.handle().pipe(
      tap(async (value: string) => {
        await this.redisService.set({ key: cachedKey, value, ttl });
      }),
    );
  }
}
