import { S3Service } from "../services/aws";
import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
export declare class RequestPublicFile implements NestMiddleware {
    private readonly s3Service;
    constructor(s3Service: S3Service);
    use(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
}
