import { S3Service } from 'src/common/services/aws';
import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestPublicFile implements NestMiddleware {
    constructor(private readonly s3Service:S3Service){}
 async use(req: Request, res: Response, next: NextFunction) {
    const { path } = req.params as { path: string[] };
    const requestFile = await this.s3Service.getAsset({Key:path.join("/")} as {Key:string})
    return res.status(HttpStatus.OK).json({message:"File fetched sucessfully",url:requestFile})
  }
}
