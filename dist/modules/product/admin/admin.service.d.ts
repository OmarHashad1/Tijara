import { Types } from 'mongoose';
import { BrandRepo } from "../../../common/repositories/brand.repo";
import { CategoryRepo } from "../../../common/repositories/category.repo";
import { ProductRepo } from "../../../common/repositories/product.repo";
import { S3Service } from "../../../common/services/aws";
import { CreateProductDto } from '../dto/createProduct.dto';
import { UpdateProductDto } from '../dto/updateProduct.dto';
import { AdjustStockDto } from '../dto/adjustStock.dto';
export declare class AdminService {
    private readonly productRepo;
    private readonly categoryRepo;
    private readonly brandRepo;
    private readonly s3Service;
    constructor(productRepo: ProductRepo, categoryRepo: CategoryRepo, brandRepo: BrandRepo, s3Service: S3Service);
    private assertCategoryAndBrand;
    private uploadProductImages;
    private deleteProductImages;
    createProduct(dto: CreateProductDto, files?: Express.Multer.File[]): Promise<import("mongoose").Document<unknown, {}, import("../../../common/types").IProduct, {}, import("mongoose").DefaultSchemaOptions> & import("../../../common/types").IProduct & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateProduct(id: Types.ObjectId, dto: UpdateProductDto, files?: Express.Multer.File[]): Promise<(import("mongoose").Document<unknown, {}, import("../../../common/types").IProduct, {}, import("mongoose").DefaultSchemaOptions> & import("../../../common/types").IProduct & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    adjustStock(id: Types.ObjectId, dto: AdjustStockDto): Promise<(import("mongoose").Document<unknown, {}, import("../../../common/types").IProduct, {}, import("mongoose").DefaultSchemaOptions> & import("../../../common/types").IProduct & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    deleteProduct(id: Types.ObjectId): Promise<void>;
}
