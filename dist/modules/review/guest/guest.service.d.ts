import { Types } from 'mongoose';
import { ProductRepo } from "../../../common/repositories/product.repo";
import { ReviewRepo } from "../../../common/repositories/review.repo";
import { ListReviewsQueryDto } from '../dto/list-reviews-query.dto';
export declare class GuestService {
    private readonly reviewRepo;
    private readonly productRepo;
    constructor(reviewRepo: ReviewRepo, productRepo: ProductRepo);
    listReviews(productId: Types.ObjectId, query: ListReviewsQueryDto): Promise<{
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
}
