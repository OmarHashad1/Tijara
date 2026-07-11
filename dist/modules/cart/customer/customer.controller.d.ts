import { Types } from 'mongoose';
import { type UserDocument } from "../../../models";
import { AddCartItemDto } from '../dto/add-cart-item.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';
import { CustomerService } from './customer.service';
export declare class CustomerController {
    private readonly customerService;
    constructor(customerService: CustomerService);
    getCart(user: UserDocument): Promise<{
        message: string;
        payload: import("mongoose").FlattenMaps<import("../../../common/types").ICart>;
    }>;
    addItem(user: UserDocument, dto: AddCartItemDto): Promise<{
        message: string;
        payload: import("mongoose").FlattenMaps<import("../../../common/types").ICart> | null;
    }>;
    updateItemQuantity(user: UserDocument, productId: Types.ObjectId, dto: UpdateCartItemDto): Promise<{
        message: string;
        payload: import("mongoose").FlattenMaps<import("../../../common/types").ICart> | null;
    }>;
    removeItem(user: UserDocument, productId: Types.ObjectId): Promise<{
        message: string;
        payload: import("mongoose").FlattenMaps<import("../../../common/types").ICart> | null;
    }>;
    clearCart(user: UserDocument): Promise<{
        message: string;
    }>;
}
