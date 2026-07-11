import { HydratedDocument, Types } from 'mongoose';
import { ORDER_STATUS, PAYMENT_PROVIDER } from "../common/enums";
import type { IOrder, IOrderItem } from "../common/types";
export type OrderDocument = HydratedDocument<IOrder>;
export declare class OrderItem implements IOrderItem {
    productId: Types.ObjectId;
    name: string;
    image: string;
    price: number;
    quantity: number;
}
export declare const OrderItemSchema: import("mongoose").Schema<OrderItem, import("mongoose").Model<OrderItem, any, any, any, any, any, OrderItem>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, OrderItem, import("mongoose").Document<unknown, {}, OrderItem, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<OrderItem & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    productId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, OrderItem, import("mongoose").Document<unknown, {}, OrderItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OrderItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, OrderItem, import("mongoose").Document<unknown, {}, OrderItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OrderItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    image?: import("mongoose").SchemaDefinitionProperty<string, OrderItem, import("mongoose").Document<unknown, {}, OrderItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OrderItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    price?: import("mongoose").SchemaDefinitionProperty<number, OrderItem, import("mongoose").Document<unknown, {}, OrderItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OrderItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    quantity?: import("mongoose").SchemaDefinitionProperty<number, OrderItem, import("mongoose").Document<unknown, {}, OrderItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<OrderItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, OrderItem>;
export declare class Order implements IOrder {
    userId: Types.ObjectId;
    items: IOrderItem[];
    couponCode: string | null;
    total: number;
    intentId?: string;
    paymentMethod: PAYMENT_PROVIDER;
    paidAt: Date | null;
    refundedAt: Date | null;
    status: ORDER_STATUS;
}
export declare const OrderSchema: import("mongoose").Schema<Order, import("mongoose").Model<Order, any, any, any, any, any, Order>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Order, import("mongoose").Document<unknown, {}, Order, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Order & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Order, import("mongoose").Document<unknown, {}, Order, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    items?: import("mongoose").SchemaDefinitionProperty<IOrderItem[], Order, import("mongoose").Document<unknown, {}, Order, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    couponCode?: import("mongoose").SchemaDefinitionProperty<string | null, Order, import("mongoose").Document<unknown, {}, Order, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    total?: import("mongoose").SchemaDefinitionProperty<number, Order, import("mongoose").Document<unknown, {}, Order, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    intentId?: import("mongoose").SchemaDefinitionProperty<string | undefined, Order, import("mongoose").Document<unknown, {}, Order, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    paymentMethod?: import("mongoose").SchemaDefinitionProperty<PAYMENT_PROVIDER, Order, import("mongoose").Document<unknown, {}, Order, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    paidAt?: import("mongoose").SchemaDefinitionProperty<Date | null, Order, import("mongoose").Document<unknown, {}, Order, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    refundedAt?: import("mongoose").SchemaDefinitionProperty<Date | null, Order, import("mongoose").Document<unknown, {}, Order, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<ORDER_STATUS, Order, import("mongoose").Document<unknown, {}, Order, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Order & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Order>;
export declare const OrderModel: import("@nestjs/common").DynamicModule;
