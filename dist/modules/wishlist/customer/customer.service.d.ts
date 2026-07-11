import { Types } from 'mongoose';
import { ProductRepo } from "../../../common/repositories/product.repo";
import { WishlistRepo } from "../../../common/repositories/wishlist.repo";
import { AddWishlistItemDto } from '../dto/add-wishlist-item.dto';
export declare class CustomerService {
    private readonly wishlistRepo;
    private readonly productRepo;
    constructor(wishlistRepo: WishlistRepo, productRepo: ProductRepo);
    private findOrCreateWishlist;
    getWishlist(userId: Types.ObjectId): Promise<import("mongoose").FlattenMaps<import("../../../common/types").IWishlist>>;
    addItem(userId: Types.ObjectId, dto: AddWishlistItemDto): Promise<import("mongoose").FlattenMaps<import("../../../common/types").IWishlist> | null>;
    removeItem(userId: Types.ObjectId, productId: Types.ObjectId): Promise<import("mongoose").FlattenMaps<import("../../../common/types").IWishlist> | null>;
}
