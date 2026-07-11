import { HydratedDocument, Types } from 'mongoose';
import type { IBrand } from "../common/types";
export type BrandDocument = HydratedDocument<IBrand>;
export declare class Brand implements IBrand {
    categoryIds: Types.ObjectId[];
    name: string;
    slug: string;
    logo: string | null;
    description: string | null;
}
export declare const BrandSchema: import("mongoose").Schema<Brand, import("mongoose").Model<Brand, any, any, any, any, any, Brand>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Brand, import("mongoose").Document<unknown, {}, Brand, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Brand & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    categoryIds?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId[], Brand, import("mongoose").Document<unknown, {}, Brand, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Brand & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, Brand, import("mongoose").Document<unknown, {}, Brand, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Brand & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    slug?: import("mongoose").SchemaDefinitionProperty<string, Brand, import("mongoose").Document<unknown, {}, Brand, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Brand & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    logo?: import("mongoose").SchemaDefinitionProperty<string | null, Brand, import("mongoose").Document<unknown, {}, Brand, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Brand & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string | null, Brand, import("mongoose").Document<unknown, {}, Brand, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Brand & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Brand>;
export declare const BrandModel: import("@nestjs/common").DynamicModule;
