import { Types } from 'mongoose';
import { CreateProductDto } from '../dto/createProduct.dto';
import { UpdateProductDto } from '../dto/updateProduct.dto';
import { AdjustStockDto } from '../dto/adjustStock.dto';
import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    createProduct(dto: CreateProductDto, images: Express.Multer.File[]): Promise<{
        message: string;
        payload: import("mongoose").Document<unknown, {}, import("../../../common/types").IProduct, {}, import("mongoose").DefaultSchemaOptions> & import("../../../common/types").IProduct & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    updateProduct(id: Types.ObjectId, dto: UpdateProductDto, images: Express.Multer.File[]): Promise<{
        message: string;
        payload: (import("mongoose").Document<unknown, {}, import("../../../common/types").IProduct, {}, import("mongoose").DefaultSchemaOptions> & import("../../../common/types").IProduct & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    adjustStock(id: Types.ObjectId, dto: AdjustStockDto): Promise<{
        message: string;
        payload: (import("mongoose").Document<unknown, {}, import("../../../common/types").IProduct, {}, import("mongoose").DefaultSchemaOptions> & import("../../../common/types").IProduct & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    deleteProduct(id: Types.ObjectId): Promise<{
        message: string;
    }>;
}
