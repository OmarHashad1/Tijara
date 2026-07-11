import { CATEGORY_STATUS } from "../../../common/enums";
import { Types } from 'mongoose';
import { CategoryRepo } from "../../../common/repositories/category.repo";
import { BrandRepo } from "../../../common/repositories/brand.repo";
import { CreateCategoryDto } from '../dto/createCategory.dto';
import { UpdateCategoryDto } from '../dto/updateCategory.dto';
export declare class AdminService {
    private readonly categoryRepo;
    private readonly brandRepo;
    constructor(categoryRepo: CategoryRepo, brandRepo: BrandRepo);
    createCategory(dto: CreateCategoryDto): Promise<{
        id: string;
        name: string;
        slug: string;
        status: CATEGORY_STATUS;
    }>;
    updateCategory(id: Types.ObjectId, dto: UpdateCategoryDto): Promise<(import("mongoose").Document<unknown, {}, import("../../../common/types").ICategory, {}, import("mongoose").DefaultSchemaOptions> & import("../../../common/types").ICategory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    deleteCategory(id: Types.ObjectId): Promise<void>;
}
