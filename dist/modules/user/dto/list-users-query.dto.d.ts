import { ROLE, USER_STATUS } from "../../../common/enums";
export declare class ListUsersQueryDto {
    search?: string;
    status?: USER_STATUS;
    role?: ROLE;
    page?: number;
    size?: number;
}
