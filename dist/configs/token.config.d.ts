declare const _default: (() => {
    user: {
        access: string | undefined;
        refresh: string | undefined;
    };
    company: {
        access: string | undefined;
        refresh: string | undefined;
    };
    admin: {
        access: string | undefined;
        refresh: string | undefined;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    user: {
        access: string | undefined;
        refresh: string | undefined;
    };
    company: {
        access: string | undefined;
        refresh: string | undefined;
    };
    admin: {
        access: string | undefined;
        refresh: string | undefined;
    };
}>;
export default _default;
