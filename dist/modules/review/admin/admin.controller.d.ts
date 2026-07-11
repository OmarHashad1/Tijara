import { Types } from 'mongoose';
import { ListAdminReviewsQueryDto } from '../dto/list-admin-reviews-query.dto';
import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    listReviews(query: ListAdminReviewsQueryDto): Promise<{
        message: string;
        payload: {
            docs: (import("mongoose").Document<unknown, {}, import("../../../common/types").IReview, {}, import("mongoose").DefaultSchemaOptions> & import("../../../common/types").IReview & Required<{
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
        };
    }>;
    deleteReview(id: Types.ObjectId): Promise<{
        message: string;
    }>;
}
