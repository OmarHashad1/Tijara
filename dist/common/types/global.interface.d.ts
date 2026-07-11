import { STORAGE_TYPE } from "../enums/multer.enum";
import { IDecodedToken } from './auth.interface';
import { ObjectCannedACL } from '@aws-sdk/client-s3';
import { UserDocument } from "../../models";
import { ContextType } from '@nestjs/common';
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
