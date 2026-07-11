import { GuestService } from './guest.service';
import { ListProductQueryInput } from '../dto/listProductsQuery.dto';
export declare class GuestResolver {
    private readonly guestService;
    constructor(guestService: GuestService);
    listProducts(query: ListProductQueryInput): Promise<{
        docs: (import("mongoose").Document<unknown, {}, import("../../../common/types").IProduct, {}, import("mongoose").DefaultSchemaOptions> & import("../../../common/types").IProduct & Required<{
            _id: import("mongoose").Types.ObjectId;
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
    getProduct(slug: string): Promise<import("mongoose").FlattenMaps<import("../../../common/types").IProduct>>;
}
