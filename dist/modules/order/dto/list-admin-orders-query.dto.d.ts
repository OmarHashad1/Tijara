import { ORDER_STATUS } from "../../../common/enums";
export declare class ListAdminOrdersQueryDto {
    status?: ORDER_STATUS;
    userId?: string;
    page?: number;
    size?: number;
}
