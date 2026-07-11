export declare enum ORDER_STATUS {
    PENDING = "pending",
    SHIPPED = "shipped",
    CONFIRMED = "confirmed",
    DELIVERED = "delivered",
    CANCELLED = "cancelled"
}
export declare const ORDER_STATUS_TRANSITIONS: Record<ORDER_STATUS, ORDER_STATUS[]>;
