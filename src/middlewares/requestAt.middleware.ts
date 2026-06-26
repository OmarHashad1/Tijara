import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestAtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req.requestedAt = new Date();
    next();
  }
}
