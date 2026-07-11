import { type RedisClientType } from '@redis/client';
import { Types } from 'mongoose';
export declare class RedisService {
    private readonly client;
    constructor(client: RedisClientType);
    private handleEvents;
    connect(): Promise<void>;
    revokedTokenPrefix(userId: string | Types.ObjectId): string;
    revokedTokenKey({ jti, userId, }: {
        jti: string;
        userId: string | Types.ObjectId;
    }): string;
    otpKey({ userId, subject, }: {
        userId: Types.ObjectId | string;
        subject: string;
    }): string;
    otpKeyPenalty({ userId, subject, }: {
        userId: Types.ObjectId | string;
        subject: string;
    }): string;
    otpKeyBlock({ userId, subject, }: {
        userId: Types.ObjectId | string;
        subject: string;
    }): string;
    set({ key, value, ttl, }: {
        key: string;
        value: string | number | object;
        ttl?: number | null;
    }): Promise<string | null>;
    get(key: string): Promise<string | object | null>;
    del(key: string | string[]): Promise<number>;
    exists(key: string): Promise<boolean>;
    getTTL(key: string): Promise<number>;
    incr(key: string): Promise<number | null>;
    CahcedKey(value: string, userId?: string | null): string;
}
