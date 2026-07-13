import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE } from 'src/common/enums';
import { AuthSocket, ctxType, IUser } from 'src/common/types';
import { type Request } from 'express';
import { GqlExecutionContext } from '@nestjs/graphql';
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
    switch (context.getType<ctxType>()) {
      case 'http': {
        const req: Request = context.switchToHttp().getRequest();
        user = req.credentials.user;
        break;
      }
      case 'graphql': {
        const req: Request =
          GqlExecutionContext.create(context).getContext().req;

        user = req.credentials.user;
        break;
      }
      case 'ws': {
        const client = context.switchToWs().getClient() as AuthSocket;
        user = client.credentials.user;
        break;
      }
      default:
        throw new BadRequestException('Invalid or unsupported protocol');
    }
    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenException('You do not have access to this resource');
    }
    return true;
  }
}
