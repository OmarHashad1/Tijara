import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ctxType } from '../types';
import { GqlExecutionContext } from '@nestjs/graphql';
import { skipEmailVerificationName } from '../decorators';

@Injectable()
export class EmailVerifiedGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const skip = this.reflector.getAllAndOverride<boolean>(
      skipEmailVerificationName,
      [context.getHandler(), context.getClass()],
    );
    if (skip) return true;

    let req: Request;

    switch (context.getType<ctxType>()) {
      case 'http': {
        req = context.switchToHttp().getRequest();
        break;
      }
      case 'graphql': {
        req = GqlExecutionContext.create(context).getContext().req;
        break;
      }
      default:
        throw new BadRequestException('Invalid or unsupported protocol');
    }

    if (!req.credentials?.user.isEmailVerified) {
      throw new ForbiddenException('Email verification required');
    }

    return true;
  }
}
