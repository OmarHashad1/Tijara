import { PAYMENT_METHOD } from "../../../common/enums";
export declare class AddPaymentMethodDto {
    method: PAYMENT_METHOD;
    last4: number;
    isDefault?: boolean;
}
