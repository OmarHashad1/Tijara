import { Types } from 'mongoose';
import { type UserDocument } from "../../../models";
import { AddWishlistItemDto } from '../dto/add-wishlist-item.dto';
import { CustomerService } from './customer.service';
export declare class CustomerController {
    private readonly customerService;
    constructor(customerService: CustomerService);
    getWishlist(user: UserDocument): Promise<{
        message: string;
        payload: import("mongoose").FlattenMaps<import("../../../common/types").IWishlist>;
    }>;
    addItem(user: UserDocument, dto: AddWishlistItemDto): Promise<{
        message: string;
        payload: import("mongoose").FlattenMaps<import("../../../common/types").IWishlist> | null;
    }>;
    removeItem(user: UserDocument, productId: Types.ObjectId): Promise<{
        message: string;
        payload: import("mongoose").FlattenMaps<import("../../../common/types").IWishlist> | null;
    }>;
}
