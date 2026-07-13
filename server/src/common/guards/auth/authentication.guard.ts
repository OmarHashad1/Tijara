import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { type Request } from 'express';
import { TokenService } from 'src/common/services/token';
import { USER_STATUS } from 'src/common/enums';
import { TOKEN_TYPE } from 'src/common/enums/auth.enum';
import { UserRepo } from 'src/common/repositories';
import { UserDocument } from 'src/models';
import { RedisService } from 'src/common/services/redis';
import { AuthSocket, ctxType } from 'src/common/types';
import { GqlExecutionContext } from '@nestjs/graphql';
import { parseCookie } from 'cookie';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userRepo: UserRepo,
    private readonly reflector: Reflector,
    private readonly redisService: RedisService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    let req: Request | AuthSocket;
    let token: string | null = null;

    const type =
      this.reflector.getAllAndOverride<TOKEN_TYPE>('tokenType', [
        context.getHandler(),
        context.getClass(),
      ]) ?? 'access';

    switch (context.getType<ctxType>()) {
      case 'http': {
        req = context.switchToHttp().getRequest() as Request;
        token =
          type == TOKEN_TYPE.ACCESS
            ? req.cookies.accessToken
            : req.cookies.refreshToken;
        break;
      }
      case 'graphql': {
        req = GqlExecutionContext.create(context).getContext().req as Request;
        token =
          type === TOKEN_TYPE.ACCESS
            ? req.cookies.accessToken
            : req.cookies.refreshToken;
        break;
      }
      case 'ws': {
        req = context.switchToWs().getClient() as AuthSocket;
        const rawCookie = req.handshake.headers.cookie;
        if (!rawCookie) return false;
        const cookie = parseCookie(rawCookie as string) as unknown as {
          accessToken: string;
          refreshToken: string;
        };
        token =
          type == TOKEN_TYPE.ACCESS
            ? (cookie.accessToken as string)
            : (cookie.refreshToken as string);

        break;
      }
      default:
        throw new BadRequestException('Invalid or unsupported protocol');
    }

    if (!token) return false;

    req.credentials = await this.validateToken(token, type);
    return true;
  }

  async validateToken(token: string, type: TOKEN_TYPE)  {
    const decoded = await this.tokenService.decodeToken({
      token,
      type,
    });

    const user: UserDocument | null = await this.userRepo.findOne({
      filter: { _id: decoded._id },
      options: { lean: false, paranoId: false },
    });
    if (!user) throw new NotFoundException('User not found');

    if (user.deletedAt) throw new NotFoundException('User not found');

    if (
      user.credentialsChangedAt &&
      decoded.iat < user.credentialsChangedAt.getTime() / 1000
    ) {
      throw new BadRequestException('Invalid session. Please login again');
    }

    if (
      await this.redisService.get(
        this.redisService.revokedTokenKey({
          jti: decoded.jti,
          userId: user._id,
        }),
      )
    ) {
      throw new BadRequestException('Invalid session. Please login again');
    }

    if (user.status === USER_STATUS.BANNED)
      throw new ForbiddenException(
        'Your account is banned. Please contact support',
      );
    if (user.status === USER_STATUS.DEACTIVATED)
      throw new BadRequestException('Your account is deactivated');

    return { user, decoded };
  }
}
