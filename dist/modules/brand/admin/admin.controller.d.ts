import { Types } from 'mongoose';
import { CreateBrandDto } from '../dto/createBrand.dto';
import { UpdateBrandDto } from '../dto/updateBrand.dto';
import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    createBrand(dto: CreateBrandDto, logo?: Express.Multer.File): Promise<{
        message: string;
        payload: import("mongoose").Document<unknown, {}, import("../../../common/types").IBrand, {}, import("mongoose").DefaultSchemaOptions> & import("../../../common/types").IBrand & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    updateBrand(id: Types.ObjectId, dto: UpdateBrandDto, logo?: Express.Multer.File): Promise<{
        message: string;
        payload: (import("mongoose").Document<unknown, {}, import("../../../common/types").IBrand, {}, import("mongoose").DefaultSchemaOptions> & import("../../../common/types").IBrand & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    deleteBrand(id: Types.ObjectId): Promise<{
        message: string;
    }>;
}
