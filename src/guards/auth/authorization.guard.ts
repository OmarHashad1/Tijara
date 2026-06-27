import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE } from 'src/enums';
import { IUser } from 'src/types';
import { type Request } from 'express';
@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.getAllAndOverride<ROLE[]>(
      'allowedRoles',
      [context.getHandler(), context.getClass()],
    );
    if (!allowedRoles)
      throw new InternalServerErrorException('Allowed roles must be provided');

    let user: IUser;
    switch (context.getType()) {
      case 'http': {
        const req: Request = context.switchToHttp().getRequest();
        user = req.credentials.user;
        break;
      }
      case 'ws':
      case 'rpc':
      default:
        throw new BadRequestException('Invalid protocol');
    }
    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenException('You do not have access to this resource');
    }
    return true;
  }
}
