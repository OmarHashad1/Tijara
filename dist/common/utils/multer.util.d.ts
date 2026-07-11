import { IMulterUpload } from '../types/multer.interface';
import { Request } from 'express';
export declare const uploadFile: ({ opts, storageType, }: {
    opts: IMulterUpload;
    storageType?: string;
}) => {
    storage: import("multer").StorageEngine;
    fileFilter: (_req: Request, file: Express.Multer.File, cb: Function) => void;
    limits: {
        fileSize: number;
    };
};
export declare const uploadBrandLogo: {
    storage: import("multer").StorageEngine;
    fileFilter: (_req: Request, file: Express.Multer.File, cb: Function) => void;
    limits: {
        fileSize: number;
    };
};
export declare const uploadProductImages: {
    storage: import("multer").StorageEngine;
    fileFilter: (_req: Request, file: Express.Multer.File, cb: Function) => void;
    limits: {
        fileSize: number;
    };
};
