import { Model, AnyKeys, CreateOptions, HydratedDocument, QueryFilter, ProjectionType, QueryOptions, FlattenMaps, UpdateQuery, UpdateWriteOpResult, MongooseUpdateQueryOptions, mongo } from 'mongoose';
export declare abstract class DatabaseRepo<RawDoc> {
    protected readonly model: Model<RawDoc>;
    constructor(model: Model<RawDoc>);
    create({ data, options, }: {
        options?: CreateOptions;
        data: AnyKeys<RawDoc>;
    }): Promise<HydratedDocument<RawDoc>>;
    create({ data, options, }: {
        data: AnyKeys<RawDoc>[];
        options: CreateOptions;
    }): Promise<HydratedDocument<RawDoc>[]>;
    findOne({ filter, projection, options, }: {
        filter: QueryFilter<RawDoc>;
        projection?: ProjectionType<RawDoc> | undefined;
        options: (QueryOptions<RawDoc> & {
            lean: false;
        }) | null | undefined;
    }): Promise<HydratedDocument<RawDoc> | null>;
    findOne({ filter, projection, options, }: {
        filter: QueryFilter<RawDoc>;
        projection?: ProjectionType<RawDoc> | undefined;
        options?: (QueryOptions<RawDoc> & {
            lean: true;
        }) | null | undefined;
    }): Promise<FlattenMaps<RawDoc> | null>;
    find({ filter, projection, options, }: {
        filter: QueryFilter<RawDoc>;
        projection?: ProjectionType<RawDoc> | undefined;
        options?: QueryOptions<RawDoc> & {
            lean: false;
        };
    }): Promise<HydratedDocument<RawDoc>[] | null>;
    find({ filter, projection, options, }: {
        filter: QueryFilter<RawDoc>;
        projection?: ProjectionType<RawDoc> | undefined;
        options: QueryOptions<RawDoc> & {
            lean: true;
        };
    }): Promise<FlattenMaps<RawDoc>[] | null>;
    findOneAndUpdate({ filter, update, options, }: {
        filter: QueryFilter<RawDoc>;
        update: UpdateQuery<RawDoc>;
        options?: QueryOptions<RawDoc>;
    }): Promise<import("mongoose").IfAny<RawDoc, any, import("mongoose").Document<unknown, {}, RawDoc, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Require_id<RawDoc> & {
        __v: number;
    } & import("mongoose").AddDefaultId<RawDoc, {}, import("mongoose").DefaultSchemaOptions>> | null>;
    paginate({ filter, options, projection, page, size, }: {
        filter: QueryFilter<RawDoc>;
        projection?: ProjectionType<RawDoc> | undefined;
        options: QueryOptions<RawDoc>;
        page: number | string | undefined;
        size: number | string | undefined;
    }): Promise<{
        docs: HydratedDocument<RawDoc>[] | null;
        meta: {
            count?: number | undefined;
            page?: string | number | undefined;
            size?: string | number | undefined;
            pages?: number | undefined;
        };
    }>;
    updateOne({ filter, update, options, }: {
        filter: QueryFilter<RawDoc>;
        update: UpdateQuery<RawDoc>;
        options?: mongo.UpdateOptions & MongooseUpdateQueryOptions<RawDoc>;
    }): Promise<UpdateWriteOpResult>;
    updateOne({ filter, update, }: {
        filter: QueryFilter<RawDoc>;
        update: UpdateQuery<RawDoc>;
    }): Promise<UpdateWriteOpResult>;
    updateMany({ filter, update, options, }: {
        filter: QueryFilter<RawDoc>;
        update: UpdateQuery<RawDoc>;
        options?: mongo.UpdateOptions & MongooseUpdateQueryOptions<RawDoc>;
    }): Promise<UpdateWriteOpResult>;
    deleteOne({ filter, }: {
        filter: QueryFilter<RawDoc>;
    }): Promise<mongo.DeleteResult>;
}
