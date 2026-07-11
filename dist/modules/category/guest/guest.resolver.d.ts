import { GuestService } from './guest.service';
export declare class GuestResolver {
    private readonly guestService;
    constructor(guestService: GuestService);
    categories(): Promise<(import("mongoose").Document<unknown, {}, import("../../../common/types").ICategory, {}, import("mongoose").DefaultSchemaOptions> & import("../../../common/types").ICategory & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[] | null>;
    category(slug: string): Promise<{
        brands: (import("mongoose").Document<unknown, {}, import("../../../common/types").IBrand, {}, import("mongoose").DefaultSchemaOptions> & import("../../../common/types").IBrand & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[] | null;
        _id: import("mongoose").Types.ObjectId;
        name: string;
        slug: string;
        status: import("../../../common/enums").CATEGORY_STATUS;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
        __v: number;
    }>;
}
