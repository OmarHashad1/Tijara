import { Request } from 'express';
export interface IMulterUpload {
    allwedMimType: string[];
    fileSize: number;
    buildFileName: (req: Request, file: Express.Multer.File) => string;
}
