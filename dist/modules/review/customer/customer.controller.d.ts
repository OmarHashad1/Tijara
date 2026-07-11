import { Types } from 'mongoose';
import { type UserDocument } from "../../../models";
import { CreateReviewDto } from '../dto/create-review.dto';
import { UpdateReviewDto } from '../dto/update-review.dto';
import { CustomerService } from './customer.service';
export declare class CustomerController {
    private readonly customerService;
    constructor(customerService: CustomerService);
    createReview(user: UserDocument, productId: Types.ObjectId, dto: CreateReviewDto): Promise<{
        message: string;
        payload: import("mongoose").Document<unknown, {}, import("../../../common/types").IReview, {}, import("mongoose").DefaultSchemaOptions> & import("../../../common/types").IReview & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    updateReview(user: UserDocument, id: Types.ObjectId, dto: UpdateReviewDto): Promise<{
        message: string;
        payload: (import("mongoose").Document<unknown, {}, import("../../../common/types").IReview, {}, import("mongoose").DefaultSchemaOptions> & import("../../../common/types").IReview & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        }) | null;
    }>;
    deleteReview(user: UserDocument, id: Types.ObjectId): Promise<{
        message: string;
    }>;
}
