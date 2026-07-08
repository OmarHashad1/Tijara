import { diskStorage, memoryStorage } from 'multer';
import { IMulterUpload } from '../types/multer.interface';
import { tmpdir } from 'os';
import { Request } from 'express';
import { STORAGE_TYPE } from 'src/common/enums/multer.enum';
import { BadRequestException } from '@nestjs/common';
export const uploadFile = ({
  opts,
  storageType,
}: {
  opts: IMulterUpload;
  storageType?: string;
}) => {
  return {
    storage:
      storageType == STORAGE_TYPE.MEMORY
        ? memoryStorage()
        : diskStorage({
            destination: (
              _req: Request,
              _file: Express.Multer.File,
              cb: Function,
            ) => cb(null, tmpdir()),
            filename: (
              req: Request,
              file: Express.Multer.File,
              cb: Function,
            ) => {
              const fileExtention = file.originalname.split('.').at(-1);
              cb(null, `${opts.buildFileName(req, file)}.${fileExtention}`);
            },
          }),
    fileFilter: (_req: Request, file: Express.Multer.File, cb: Function) => {
      if (opts.allwedMimType.includes(file.mimetype)) cb(null, true);
      else
        cb(
          new BadRequestException(`Invalid file type: ${file.mimetype}`),
          false,
        );
    },
    limits: { fileSize: opts.fileSize },
  };
};

export const uploadBrandLogo = uploadFile({
  opts: {
    allwedMimType: ['image/png', 'image/jpeg', 'image/webp'],
    fileSize: 2 * 1024 * 1024,
    buildFileName: (req: Request, file: Express.Multer.File) =>
      `${req.credentials.user.firstName}_${file.originalname}_${crypto.randomUUID()}`,
  },
  storageType: STORAGE_TYPE.DISK,
});

export const uploadProductImages = uploadFile({
  opts: {
    allwedMimType: ['image/png', 'image/jpeg', 'image/webp'],
    fileSize: 5 * 1024 * 1024,
    buildFileName: (_req: Request, _file: Express.Multer.File) =>
      `product_${crypto.randomUUID()}`,
  },
  storageType: STORAGE_TYPE.MEMORY,
});
