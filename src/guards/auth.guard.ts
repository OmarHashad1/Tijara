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
import { FlattenMaps } from 'mongoose';
import { TokenService } from 'src/common/services/token';
import { USER_STATUS } from 'src/enums';
import { TOKEN_TYPE } from 'src/enums/auth.enums';
import { UserRepo } from 'src/repositories';
import { IDecodedToken, IUser } from 'src/types';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userRepo: UserRepo,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    let req: Request;
    let token: string;
    switch (context.getType()) {
      case 'http':
        {
          req = context.switchToHttp().getRequest();
          token = req.cookies.accessToken;
        }
        break;
      default:
        throw new BadRequestException('Invalid protocol');
    }

    const type = this.reflector.getAllAndOverride<TOKEN_TYPE>('tokenType', [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log(type);
    const decoded = await this.tokenService.decodeToken({
      token,
      type,
    });

    const user = await this.userRepo.findOne({ filter: { _id: decoded._id } });
    if (!user) throw new NotFoundException('User not found');
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
