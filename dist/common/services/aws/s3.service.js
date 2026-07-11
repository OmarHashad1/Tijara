"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const config_1 = require("@nestjs/config");
const multer_enum_1 = require("../../enums/multer.enum");
const client_s3_1 = require("@aws-sdk/client-s3");
const node_crypto_1 = require("node:crypto");
const node_fs_1 = require("node:fs");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const common_1 = require("@nestjs/common");
let S3Service = class S3Service {
    configService;
    client;
    AWS_REGION;
    AWS_ACCESS_KEY_ID;
    AWS_SECRET_ACCESS_KEY;
    AWS_BUCKET_NAME;
    AWS_EXPIRATION;
    constructor(configService) {
        this.configService = configService;
        this.AWS_REGION = this.configService.get('AWS_REGION');
        this.AWS_ACCESS_KEY_ID = this.configService.get('AWS_ACCESS_KEY_ID');
        this.AWS_SECRET_ACCESS_KEY = this.configService.get('AWS_SECRET_ACCESS_KEY');
        this.AWS_BUCKET_NAME = this.configService.get('AWS_BUCKET_NAME');
        this.client = new client_s3_1.S3Client({
            region: this.AWS_REGION,
            credentials: {
                accessKeyId: this.AWS_ACCESS_KEY_ID,
                secretAccessKey: this.AWS_SECRET_ACCESS_KEY,
            },
        });
        this.AWS_EXPIRATION = Number(this.configService.get('AWS_EXPIRATION'));
        this.client = new client_s3_1.S3Client({
            region: this.AWS_REGION,
            credentials: {
                accessKeyId: this.AWS_ACCESS_KEY_ID,
                secretAccessKey: this.AWS_SECRET_ACCESS_KEY,
            },
        });
    }
    async creteaUploadPresignedUrl({ storageStrategy = multer_enum_1.STORAGE_TYPE.MEMORY, Bucket = this.AWS_BUCKET_NAME, path, file, ACL, contentType, }) {
        const command = new client_s3_1.PutObjectCommand({
            Bucket,
            Key: `${this.configService.get('APPLICATION_NAME')}/${path}/${file.fieldname}/${file.filename ? file.filename : (0, node_crypto_1.randomUUID)() + `${file.originalname}`}`,
            ACL,
            Body: storageStrategy === multer_enum_1.STORAGE_TYPE.MEMORY
                ? file.buffer
                : (0, node_fs_1.createReadStream)(file.path),
            ContentType: file.mimetype || contentType,
        });
    }
    async getPresignedURL({ command, expiresIn, }) {
        return await (0, s3_request_presigner_1.getSignedUrl)(this.client, command, expiresIn);
    }
    async uploadAsset({ storageStrategy = multer_enum_1.STORAGE_TYPE.MEMORY, Bucket = this.AWS_BUCKET_NAME, path, file, ACL, contentType, }) {
        const command = new client_s3_1.PutObjectCommand({
            Bucket,
            Key: `${this.configService.get('APPLICATION_NAME')}/${path}/${file.fieldname}/${file.filename ? file.filename : (0, node_crypto_1.randomUUID)() + `${file.originalname}`}`,
            ACL,
            Body: storageStrategy === multer_enum_1.STORAGE_TYPE.MEMORY
                ? file.buffer
                : (0, node_fs_1.createReadStream)(file.path),
            ContentType: file.mimetype || contentType,
        });
        if (!command.input?.Key)
            throw new common_1.InternalServerErrorException('Failed to upload asset');
        await this.client.send(command);
        return command.input?.Key;
    }
    async uploadAssets({ files, path = '/company/global' }) {
        const filesLinks = {
            taxCard: '',
            commercialRegistration: '',
        };
        await Promise.all(files.map(async (file) => {
            const link = await this.uploadAsset({
                storageStrategy: multer_enum_1.STORAGE_TYPE.DISK,
                file,
                path,
            });
            filesLinks[file.fieldname] = link;
        }));
        return filesLinks;
    }
    async getAsset({ Bucket = this.AWS_BUCKET_NAME, Key, }) {
        const command = new client_s3_1.GetObjectCommand({ Bucket, Key });
        return await this.getPresignedURL({
            command,
            expiresIn: { expiresIn: 130 },
        });
    }
    async deleteAsset({ Bucket = this.AWS_BUCKET_NAME, Key, }) {
        const command = new client_s3_1.DeleteObjectCommand({ Bucket, Key });
        return await this.client.send(command);
    }
    async deleteAssets(Keys) {
        await Promise.all(Keys.map((Key) => {
            return this.deleteAsset({ Key });
        }));
    }
    async assetExists({ Key, Bucket = this.AWS_BUCKET_NAME, }) {
        try {
            await this.client.send(new client_s3_1.HeadObjectCommand({ Bucket, Key }));
            return true;
        }
        catch (err) {
            if (err instanceof Error &&
                (err.name === 'NotFound' || err.name === 'NoSuchKey'))
                return false;
            throw err;
        }
    }
    async copyAsset({ sourceKey, destKey, Bucket = this.AWS_BUCKET_NAME, }) {
        const command = new client_s3_1.CopyObjectCommand({
            Bucket,
            CopySource: `${Bucket}/${sourceKey.split('/').map(encodeURIComponent).join('/')}`,
            Key: destKey,
        });
        await this.client.send(command);
        return destKey;
    }
};
exports.S3Service = S3Service;
exports.S3Service = S3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], S3Service);
//# sourceMappingURL=s3.service.js.map