import { Types } from 'mongoose';
import { ListAdminOrdersQueryDto } from '../dto/list-admin-orders-query.dto';
import { UpdateOrderStatusDto } from '../dto/update-order-status.dto';
import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    listOrders(query: ListAdminOrdersQueryDto): Promise<{
        message: string;
        payload: {
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
        };
    }>;
    getOrder(id: Types.ObjectId): Promise<{
        message: string;
        payload: import("mongoose").FlattenMaps<import("../../../common/types").IOrder>;
    }>;
    updateStatus(id: Types.ObjectId, dto: UpdateOrderStatusDto): Promise<{
        message: string;
        payload: import("mongoose").FlattenMaps<import("../../../common/types").IOrder> | null;
    }>;
}
