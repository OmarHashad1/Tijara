import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { type Request } from 'express';
import { UserDocument } from 'src/models';
export const User = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    let user: UserDocument;

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
