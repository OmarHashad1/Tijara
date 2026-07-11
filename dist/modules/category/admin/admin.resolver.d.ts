import { Types } from 'mongoose';
import { AdminService } from './admin.service';
import { CreateCategoryInput } from '../dto/createCategory.dto';
import { UpdateCategoryInput } from '../dto/updateCategory.dto';
export declare class AdminResolver {
    private readonly adminService;
    constructor(adminService: AdminService);
    createCategory(input: CreateCategoryInput): Promise<{
        id: string;
        name: string;
        slug: string;
        status: import("server/src/common/enums").CATEGORY_STATUS;
    }>;
    updateCategory(id: string, input: UpdateCategoryInput): Promise<(import("mongoose").Document<unknown, {}, import("../../../common/types").ICategory, {}, import("mongoose").DefaultSchemaOptions> & import("../../../common/types").ICategory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    deleteCategory(id: string): Promise<boolean>;
}
