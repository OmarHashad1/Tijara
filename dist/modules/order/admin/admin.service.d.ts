import { Types } from 'mongoose';
import { OrderRepo } from "../../../common/repositories/order.repo";
import { ProductRepo } from "../../../common/repositories/product.repo";
import { UserRepo } from "../../../common/repositories";
import { ListAdminOrdersQueryDto } from '../dto/list-admin-orders-query.dto';
import { UpdateOrderStatusDto } from '../dto/update-order-status.dto';
export declare class AdminService {
    private readonly orderRepo;
    private readonly productRepo;
    private readonly userRepo;
    constructor(orderRepo: OrderRepo, productRepo: ProductRepo, userRepo: UserRepo);
    listOrders(query: ListAdminOrdersQueryDto): Promise<{
        docs: (import("mongoose").Document<unknown, {}, import("../../../common/types").IOrder, {}, import("mongoose").DefaultSchemaOptions> & import("../../../common/types").IOrder & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[] | null;
        meta: {
            count?: number | undefined;
            page?: string | number | undefined;
            size?: string | number | undefined;
            pages?: number | undefined;
        };
    }>;
    getOrder(id: Types.ObjectId): Promise<import("mongoose").FlattenMaps<import("../../../common/types").IOrder>>;
    updateStatus(id: Types.ObjectId, dto: UpdateOrderStatusDto): Promise<import("mongoose").FlattenMaps<import("../../../common/types").IOrder> | null>;
}
