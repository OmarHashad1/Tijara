import { EventEmitter } from 'stream';
import { EMAIL_EVENTS } from '../enums/email.enums';
export interface EMAIL_EVENTS_PAYLOAD {
    [EMAIL_EVENTS.FORGOT_PASSWORD]: {
        to: string;
        firstName: string;
        otp: string;
    };
    [EMAIL_EVENTS.VERIFY_EMAIL]: {
        to: string;
        firstName: string;
        otp: string;
    };
    [EMAIL_EVENTS.ORDER_CONFIRMED]: {
        to: string;
        firstName: string;
        orderId: string;
        total: number;
    };
    [EMAIL_EVENTS.ORDER_CANCELLED]: {
        to: string;
        firstName: string;
        orderId: string;
    };
    [EMAIL_EVENTS.ORDER_REFUNDED]: {
        to: string;
        firstName: string;
        orderId: string;
        amount: number;
    };
    [EMAIL_EVENTS.ORDER_STATUS_UPDATED]: {
        to: string;
        firstName: string;
        orderId: string;
        status: string;
    };
    [EMAIL_EVENTS.USER_BANNED]: {
        to: string;
        firstName: string;
        reason: string;
    };
    [EMAIL_EVENTS.USER_UNBANNED]: {
        to: string;
        firstName: string;
    };
}
declare class EmailEmitter extends EventEmitter {
    emit<K extends keyof EMAIL_EVENTS_PAYLOAD>(event: K, payload: EMAIL_EVENTS_PAYLOAD[K]): boolean;
    on<K extends keyof EMAIL_EVENTS_PAYLOAD>(event: K, listner: (args: EMAIL_EVENTS_PAYLOAD[K]) => void): this;
}
export declare const emailEmitter: EmailEmitter;
export {};
