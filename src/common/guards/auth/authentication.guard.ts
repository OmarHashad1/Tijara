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
@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userRepo: UserRepo,
    private readonly reflector: Reflector,
    private readonly redisService: RedisService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    let req: Request;
    let token: string;

    const type = this.reflector.getAllAndOverride<TOKEN_TYPE>('tokenType', [
      context.getHandler(),
      context.getClass(),
    ]);

    switch (context.getType()) {
      case 'http':
        {
          req = context.switchToHttp().getRequest();
          token =
            type == TOKEN_TYPE.ACCESS
              ? req.cookies.accessToken
              : req.cookies.refreshToken;
        }
        break;
      default:
        throw new BadRequestException('Invalid protocol');
    }

    const decoded = await this.tokenService.decodeToken({
      token,
      type,
    });

    const user: UserDocument | null = await this.userRepo.findOne({
      filter: { _id: decoded._id },
      options: { lean: false },
    });

    if (!user) throw new NotFoundException('User not found');

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

    req.credentials = { user, decoded };
    return true;
  }
}
