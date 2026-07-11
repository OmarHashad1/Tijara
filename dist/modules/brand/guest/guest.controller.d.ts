import { getSingleBrand } from '../dto/getSingleBrand.dto';
import { GuestService } from './guest.service';
export declare class GuestController {
    private readonly guestService;
    constructor(guestService: GuestService);
    listBrands(): Promise<{
        message: string;
        payload: import("mongoose").FlattenMaps<import("../../../common/types").IBrand>[] | null;
    }>;
    getSingleBrand(dto: getSingleBrand): Promise<{
        message: string;
        payload: import("mongoose").FlattenMaps<import("../../../common/types").IBrand>;
    }>;
}
