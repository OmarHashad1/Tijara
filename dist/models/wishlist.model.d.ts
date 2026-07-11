import { HydratedDocument, Types } from 'mongoose';
import type { IWishlist } from "../common/types";
export type WishlistDocument = HydratedDocument<IWishlist>;
export declare class Wishlist implements IWishlist {
    userId: Types.ObjectId;
    productIds: Types.ObjectId[];
}
export declare const WishlistSchema: import("mongoose").Schema<Wishlist, import("mongoose").Model<Wishlist, any, any, any, any, any, Wishlist>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Wishlist, import("mongoose").Document<unknown, {}, Wishlist, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Wishlist & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Wishlist, import("mongoose").Document<unknown, {}, Wishlist, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Wishlist & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    productIds?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId[], Wishlist, import("mongoose").Document<unknown, {}, Wishlist, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Wishlist & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Wishlist>;
export declare const WishlistModel: import("@nestjs/common").DynamicModule;
