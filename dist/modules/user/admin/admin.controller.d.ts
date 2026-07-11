import { Types } from 'mongoose';
import { AdminService } from './admin.service';
import { BanUserDto } from '../dto/ban-user.dto';
import { ListUsersQueryDto } from '../dto/list-users-query.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    listUsers(query: ListUsersQueryDto): Promise<{
        docs: (import("mongoose").Document<unknown, {}, import("../../../common/types").IUser, {}, import("mongoose").DefaultSchemaOptions> & import("../../../common/types").IUser & Required<{
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
    getUser(id: Types.ObjectId): Promise<import("mongoose").FlattenMaps<import("../../../common/types").IUser>>;
    banUser(id: Types.ObjectId, dto: BanUserDto): Promise<void>;
    unbanUser(id: Types.ObjectId): Promise<void>;
    softDeleteUser(id: Types.ObjectId): Promise<void>;
    hardDeleteUser(id: Types.ObjectId): Promise<void>;
    restoreUser(id: Types.ObjectId): Promise<void>;
}
