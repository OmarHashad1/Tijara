import { Types } from 'mongoose';
import { CartRepo } from "../../../common/repositories/cart.repo";
import { ProductRepo } from "../../../common/repositories/product.repo";
import { AddCartItemDto } from '../dto/add-cart-item.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';
export declare class CustomerService {
    private readonly cartRepo;
    private readonly productRepo;
    constructor(cartRepo: CartRepo, productRepo: ProductRepo);
    private findOrCreateCart;
    getCart(userId: Types.ObjectId): Promise<import("mongoose").FlattenMaps<import("../../../common/types").ICart>>;
    addItem(userId: Types.ObjectId, dto: AddCartItemDto): Promise<import("mongoose").FlattenMaps<import("../../../common/types").ICart> | null>;
    updateItemQuantity(userId: Types.ObjectId, productId: Types.ObjectId, dto: UpdateCartItemDto): Promise<import("mongoose").FlattenMaps<import("../../../common/types").ICart> | null>;
    removeItem(userId: Types.ObjectId, productId: Types.ObjectId): Promise<import("mongoose").FlattenMaps<import("../../../common/types").ICart> | null>;
    clearCart(userId: Types.ObjectId): Promise<void>;
}
