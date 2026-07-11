import { Types } from 'mongoose';
import { GuestService } from './guest.service';
export declare class GuestController {
    private readonly guestService;
    constructor(guestService: GuestService);
    listCategoryBrands(id: Types.ObjectId): Promise<{
        message: string;
        payload: (import("mongoose").Document<unknown, {}, import("../../../common/types").IBrand, {}, import("mongoose").DefaultSchemaOptions> & import("../../../common/types").IBrand & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[] | null;
    }>;
}
