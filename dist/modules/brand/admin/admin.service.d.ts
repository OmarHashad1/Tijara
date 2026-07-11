import { Types } from 'mongoose';
import { BrandRepo } from "../../../common/repositories/brand.repo";
import { CategoryRepo } from "../../../common/repositories/category.repo";
import { S3Service } from "../../../common/services/aws";
import { CreateBrandDto } from '../dto/createBrand.dto';
import { UpdateBrandDto } from '../dto/updateBrand.dto';
export declare class AdminService {
    private readonly brandRepo;
    private readonly categoryRepo;
    private readonly s3Service;
    constructor(brandRepo: BrandRepo, categoryRepo: CategoryRepo, s3Service: S3Service);
    private assertCategoriesExist;
    private uploadLogo;
    createBrand(dto: CreateBrandDto, logo?: Express.Multer.File): Promise<import("mongoose").Document<unknown, {}, import("../../../common/types").IBrand, {}, import("mongoose").DefaultSchemaOptions> & import("../../../common/types").IBrand & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateBrand(id: Types.ObjectId, dto: UpdateBrandDto, logo?: Express.Multer.File): Promise<(import("mongoose").Document<unknown, {}, import("../../../common/types").IBrand, {}, import("mongoose").DefaultSchemaOptions> & import("../../../common/types").IBrand & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    deleteBrand(id: Types.ObjectId): Promise<void>;
}
