import { ConfigService } from '@nestjs/config';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { IS3UploadAsset, IS3UploadAssets } from '../../types';
export declare class S3Service {
    private readonly configService;
    private readonly client;
    private readonly AWS_REGION;
    private readonly AWS_ACCESS_KEY_ID;
    private readonly AWS_SECRET_ACCESS_KEY;
    private readonly AWS_BUCKET_NAME;
    private readonly AWS_EXPIRATION;
    constructor(configService: ConfigService);
    creteaUploadPresignedUrl({ storageStrategy, Bucket, path, file, ACL, contentType, }: IS3UploadAsset): Promise<void>;
    getPresignedURL({ command, expiresIn, }: {
        command: PutObjectCommand;
        expiresIn: {
            expiresIn: number;
        };
    }): Promise<string>;
    uploadAsset({ storageStrategy, Bucket, path, file, ACL, contentType, }: IS3UploadAsset): Promise<string>;
    uploadAssets({ files, path }: IS3UploadAssets): Promise<Record<string, string>>;
    getAsset({ Bucket, Key, }: {
        Bucket?: string;
        Key: string;
    }): Promise<string>;
    deleteAsset({ Bucket, Key, }: {
        Bucket?: string;
        Key: string;
    }): Promise<import("@aws-sdk/client-s3").DeleteObjectCommandOutput>;
    deleteAssets(Keys: string[]): Promise<void>;
    assetExists({ Key, Bucket, }: {
        Key: string;
        Bucket?: string;
    }): Promise<boolean>;
    copyAsset({ sourceKey, destKey, Bucket, }: {
        sourceKey: string;
        destKey: string;
        Bucket?: string;
    }): Promise<string>;
}
