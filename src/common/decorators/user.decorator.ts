import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { IUser } from 'src/common/types';
import { type Request } from 'express';
export const User = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    let user: IUser;

    switch (ctx.getType()) {
      case 'http': {
        user = (ctx.switchToHttp().getRequest() as Request).credentials.user;
        break;
      }
      case 'ws':
      case 'rpc':
      default:
        throw new BadRequestException('Invalid protocol');
    }

    return user;
  },
);
