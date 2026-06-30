import { STORAGE_TYPE } from 'src/enums/multer.enum';
import { IDecodedToken } from './auth.interface';
import { IUser } from './user.interface';
import { ObjectCannedACL } from '@aws-sdk/client-s3';

declare global {
  namespace Express {
    interface Request {
      requestedAt: Date;
      credentials: {
        user: IUser;
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
