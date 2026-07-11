export declare enum ROLE {
    USER = "user",
    ADMIN = "admin"
}
export declare enum USER_STATUS {
    ACTIVE = "active",
    DEACTIVATED = "deativated",
    BANNED = "BANNED"
}
export declare const USER_STATUS_TRANSITIONS: {
    readonly ban: readonly [USER_STATUS.ACTIVE, USER_STATUS.DEACTIVATED];
    readonly unban: readonly [USER_STATUS.BANNED];
};
export declare enum PAYMENT_METHOD {
    CARD = "card",
    POD = "POD"
}
