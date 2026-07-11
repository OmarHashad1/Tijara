import { Types } from 'mongoose';
import { OrderRepo } from "../../../common/repositories/order.repo";
import { ProductRepo } from "../../../common/repositories/product.repo";
import { ReviewRepo } from "../../../common/repositories/review.repo";
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
export declare class CustomerService {
    private readonly reviewRepo;
    private readonly orderRepo;
    private readonly productRepo;
    constructor(reviewRepo: ReviewRepo, orderRepo: OrderRepo, productRepo: ProductRepo);
    createReview(userId: Types.ObjectId, productId: Types.ObjectId, dto: CreateReviewDto): Promise<import("mongoose").Document<unknown, {}, import("../../../common/types").IReview, {}, import("mongoose").DefaultSchemaOptions> & import("../../../common/types").IReview & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateReview(userId: Types.ObjectId, id: Types.ObjectId, dto: UpdateReviewDto): Promise<(import("mongoose").Document<unknown, {}, import("../../../common/types").IReview, {}, import("mongoose").DefaultSchemaOptions> & import("../../../common/types").IReview & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    deleteReview(userId: Types.ObjectId, id: Types.ObjectId): Promise<void>;
}
