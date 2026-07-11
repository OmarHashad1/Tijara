import { Types } from 'mongoose';
import { ProductRepo } from "../../../common/repositories/product.repo";
import { ListProductsQueryDto } from '../dto/listProductsQuery.dto';
export declare class GuestService {
    private readonly productRepo;
    constructor(productRepo: ProductRepo);
    listProducts(query: ListProductsQueryDto): Promise<{
        docs: (import("mongoose").Document<unknown, {}, import("../../../common/types").IProduct, {}, import("mongoose").DefaultSchemaOptions> & import("../../../common/types").IProduct & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[] | null;
        meta: {
            count?: number | undefined;
            page?: string | number | undefined;
            size?: string | number | undefined;
            pages?: number | undefined;
        };
    }>;
    getSingleProduct({ slug }: {
        slug: string;
    }): Promise<import("mongoose").FlattenMaps<import("../../../common/types").IProduct>>;
}
