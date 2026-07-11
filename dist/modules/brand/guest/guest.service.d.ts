import { BrandRepo } from "../../../common/repositories/brand.repo";
export declare class GuestService {
    private readonly brandRepo;
    constructor(brandRepo: BrandRepo);
    listBrands(): Promise<import("mongoose").FlattenMaps<import("../../../common/types").IBrand>[] | null>;
    getSingleBrand({ slug }: {
        slug: string;
    }): Promise<import("mongoose").FlattenMaps<import("../../../common/types").IBrand>>;
}
