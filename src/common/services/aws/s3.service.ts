import { ConfigService } from '@nestjs/config';
import { STORAGE_TYPE } from 'src/common/enums/multer.enum';
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

import { IS3UploadAsset, IS3UploadAssets } from '../../types';
import { randomUUID } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class S3Service {
  private readonly client: S3Client;
  private readonly AWS_REGION!: string;
  private readonly AWS_ACCESS_KEY_ID!: string;
  private readonly AWS_SECRET_ACCESS_KEY!: string;
  private readonly AWS_BUCKET_NAME!: string;
  private readonly AWS_EXPIRATION!: number;

  constructor(private readonly configService: ConfigService) {
    this.AWS_REGION = this.configService.get<string>('AWS_REGION') as string;
    this.AWS_ACCESS_KEY_ID = this.configService.get<string>(
      'AWS_ACCESS_KEY_ID',
    ) as string;
    this.AWS_SECRET_ACCESS_KEY = this.configService.get<string>(
      'AWS_SECRET_ACCESS_KEY',
    ) as string;

    this.AWS_BUCKET_NAME = this.configService.get<string>(
      'AWS_BUCKET_NAME',
    ) as string;
    this.client = new S3Client({
      region: this.AWS_REGION,
      credentials: {
        accessKeyId: this.AWS_ACCESS_KEY_ID,
        secretAccessKey: this.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.AWS_EXPIRATION = Number(
      this.configService.get<string>('AWS_EXPIRATION'),
    );
    this.client = new S3Client({
      region: this.AWS_REGION,
      credentials: {
        accessKeyId: this.AWS_ACCESS_KEY_ID,
        secretAccessKey: this.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async creteaUploadPresignedUrl({
    storageStrategy = STORAGE_TYPE.MEMORY,
    Bucket = this.AWS_BUCKET_NAME,
    path,
    file,
    ACL,
    contentType,
  }: IS3UploadAsset) {
    const command = new PutObjectCommand({
      Bucket,
      Key: `${this.configService.get<string>('APPLICATION_NAME')}/${path}/${file.fieldname}/${file.filename ? file.filename : randomUUID() + `${file.originalname}`}`,
      ACL,
      Body:
        storageStrategy === STORAGE_TYPE.MEMORY
          ? file.buffer
          : createReadStream(file.path),
      ContentType: file.mimetype || contentType,
    });
  }

  async getPresignedURL({
    command,
    expiresIn,
  }: {
    command: PutObjectCommand;
    expiresIn: { expiresIn: number };
  }) {
    return await getSignedUrl(this.client, command, expiresIn);
  }

  async uploadAsset({
    storageStrategy = STORAGE_TYPE.MEMORY,
    Bucket = this.AWS_BUCKET_NAME,
    path,
    file,
    ACL,
    contentType,
  }: IS3UploadAsset): Promise<string> {
    const command = new PutObjectCommand({
      Bucket,
      Key: `${this.configService.get<string>('APPLICATION_NAME')}/${path}/${file.fieldname}/${file.filename ? file.filename : randomUUID() + `${file.originalname}`}`,
      ACL,
      Body:
        storageStrategy === STORAGE_TYPE.MEMORY
          ? file.buffer
          : createReadStream(file.path),
      ContentType: file.mimetype || contentType,
    });
    if (!command.input?.Key)
      throw new InternalServerErrorException('Failed to upload asset');

    await this.client.send(command);
    return command.input?.Key;
  }

  async uploadAssets({ files, path = '/company/global' }: IS3UploadAssets) {
    const filesLinks: Record<string, string> = {
      taxCard: '',
      commercialRegistration: '',
    };

    await Promise.all(
      files.map(async (file) => {
        const link = await this.uploadAsset({
          storageStrategy: STORAGE_TYPE.DISK,
          file,
          path,
        });
        filesLinks[file.fieldname as keyof typeof filesLinks] = link;
      }),
    );

    return filesLinks;
  }


  async getAsset({
    Bucket = this.AWS_BUCKET_NAME,
    Key,
  }: {
    Bucket?: string;
    Key: string;
  }) {
    const command = new GetObjectCommand({ Bucket, Key });
    return await this.getPresignedURL({
      command,
      expiresIn: { expiresIn: 130 },
    });
  }

  async deleteAsset({
    Bucket = this.AWS_BUCKET_NAME,
    Key,
  }: {
    Bucket?: string;
    Key: string;
  }) {
    const command = new DeleteObjectCommand({ Bucket, Key });
    return await this.client.send(command);
  }

  async deleteAssets(Keys: string[]) {
    await Promise.all(
      Keys.map((Key) => {
        return this.deleteAsset({ Key });
      }),
    );
  }

  async assetExists({
    Key,
    Bucket = this.AWS_BUCKET_NAME,
  }: {
    Key: string;
    Bucket?: string;
  }): Promise<boolean> {
    try {
      await this.client.send(new HeadObjectCommand({ Bucket, Key }));
      return true;
    } catch (err) {
      if (
        err instanceof Error &&
        (err.name === 'NotFound' || err.name === 'NoSuchKey')
      )
        return false;
      throw err;
    }
  }

  async copyAsset({
    sourceKey,
    destKey,
    Bucket = this.AWS_BUCKET_NAME,
  }: {
    sourceKey: string;
    destKey: string;
    Bucket?: string;
  }) {
    const command = new CopyObjectCommand({
      Bucket,
      CopySource: `${Bucket}/${sourceKey.split('/').map(encodeURIComponent).join('/')}`,
      Key: destKey,
    });
    await this.client.send(command);
    return destKey;
  }
}
