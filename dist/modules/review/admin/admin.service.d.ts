import { Types } from 'mongoose';
import { ReviewRepo } from "../../../common/repositories/review.repo";
import { ListAdminReviewsQueryDto } from '../dto/list-admin-reviews-query.dto';
export declare class AdminService {
    private readonly reviewRepo;
    constructor(reviewRepo: ReviewRepo);
    listReviews(query: ListAdminReviewsQueryDto): Promise<{
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
    }>;
    deleteReview(id: Types.ObjectId): Promise<void>;
}
