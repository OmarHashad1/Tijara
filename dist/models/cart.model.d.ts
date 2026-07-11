import { HydratedDocument, Types } from 'mongoose';
import type { ICart, ICartItem } from "../common/types";
export type CartDocument = HydratedDocument<ICart>;
export declare class CartItem implements ICartItem {
    productId: Types.ObjectId;
    quantity: number;
}
export declare const CartItemSchema: import("mongoose").Schema<CartItem, import("mongoose").Model<CartItem, any, any, any, any, any, CartItem>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CartItem, import("mongoose").Document<unknown, {}, CartItem, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<CartItem & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    productId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, CartItem, import("mongoose").Document<unknown, {}, CartItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CartItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    quantity?: import("mongoose").SchemaDefinitionProperty<number, CartItem, import("mongoose").Document<unknown, {}, CartItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<CartItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, CartItem>;
export declare class Cart implements ICart {
    userId: Types.ObjectId;
    items: ICartItem[];
}
export declare const CartSchema: import("mongoose").Schema<Cart, import("mongoose").Model<Cart, any, any, any, any, any, Cart>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Cart, import("mongoose").Document<unknown, {}, Cart, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Cart & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Cart, import("mongoose").Document<unknown, {}, Cart, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Cart & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    items?: import("mongoose").SchemaDefinitionProperty<ICartItem[], Cart, import("mongoose").Document<unknown, {}, Cart, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Cart & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Cart>;
export declare const CartModel: import("@nestjs/common").DynamicModule;
