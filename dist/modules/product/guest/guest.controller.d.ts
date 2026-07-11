import { getSingleProduct } from '../dto/getSingleProduct.dto';
import { ListProductsQueryDto } from '../dto/listProductsQuery.dto';
import { GuestService } from './guest.service';
export declare class GuestController {
    private readonly guestService;
    constructor(guestService: GuestService);
    listProducts(query: ListProductsQueryDto): Promise<{
        message: string;
        payload: {
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
        };
    }>;
    getSingleProduct(dto: getSingleProduct): Promise<{
        message: string;
        payload: import("mongoose").FlattenMaps<import("../../../common/types").IProduct>;
    }>;
}
