import { Types } from 'mongoose';
import { CATEGORY_STATUS } from "../../../common/enums";
import { BrandRepo } from "../../../common/repositories/brand.repo";
import { CategoryRepo } from "../../../common/repositories/category.repo";
export declare class GuestService {
    private readonly categoryRepo;
    private readonly brandRepo;
    constructor(categoryRepo: CategoryRepo, brandRepo: BrandRepo);
    listCategories(): Promise<(import("mongoose").Document<unknown, {}, import("../../../common/types").ICategory, {}, import("mongoose").DefaultSchemaOptions> & import("../../../common/types").ICategory & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[] | null>;
    getSingleCategory({ slug }: {
        slug: string;
    }): Promise<{
        brands: (import("mongoose").Document<unknown, {}, import("../../../common/types").IBrand, {}, import("mongoose").DefaultSchemaOptions> & import("../../../common/types").IBrand & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[] | null;
        _id: Types.ObjectId;
        name: string;
        slug: string;
        status: CATEGORY_STATUS;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
        __v: number;
    }>;
    listCategoryBrands(id: Types.ObjectId): Promise<(import("mongoose").Document<unknown, {}, import("../../../common/types").IBrand, {}, import("mongoose").DefaultSchemaOptions> & import("../../../common/types").IBrand & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[] | null>;
}
