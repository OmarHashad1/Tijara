import { STORAGE_TYPE } from 'src/common/enums/multer.enum';
import { IDecodedToken } from './auth.interface';
import { ObjectCannedACL } from '@aws-sdk/client-s3';
import { UserDocument } from 'src/models';
import { ContextType } from '@nestjs/common';
import { Socket } from 'socket.io';

declare global {
  namespace Express {
    interface Request {
      requestedAt: Date;
      credentials: {
        user: UserDocument;
        decoded: IDecodedToken;
      };
    }
  }
}

export interface IS3UploadAsset {
  storageStrategy?: STORAGE_TYPE;
  Bucket?: string;
  Key?: string;
  file: Express.Multer.File;
  path: string;
  ACL?: ObjectCannedACL;
  contentType?: string | undefined;
}

export interface IS3UploadAssets {
  storageStrategy?: STORAGE_TYPE;
  Bucket?: string;
  files: Express.Multer.File[];
  path: string;
  ACL?: ObjectCannedACL;
  contentType?: string | undefined;
}

export type ctxType = ContextType | 'graphql';

export interface AuthSocket extends Socket {
  credentials: {
    user: UserDocument;
    decoded: IDecodedToken;
  };
}
