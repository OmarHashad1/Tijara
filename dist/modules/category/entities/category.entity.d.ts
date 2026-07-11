import { CATEGORY_STATUS } from "../../../common/enums";
import { BrandEntity } from "../../brand/entities/brand.entity";
export declare class CategoryEntity {
    id: string;
    name: string;
    slug?: string;
    status?: CATEGORY_STATUS;
}
export declare class CategoryWithBrands extends CategoryEntity {
    brands: BrandEntity[];
}
