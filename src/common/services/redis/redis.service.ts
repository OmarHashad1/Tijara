import { Inject, Injectable } from '@nestjs/common';
import { type RedisClientType } from '@redis/client';
import { Types } from 'mongoose';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS') private readonly client: RedisClientType) {
    this.handleEvents();
  }
  private handleEvents() {
    this.client.on('error', (err) => console.log(err));
    this.client.on('ready', () => console.log('Redis Is Connected'));
  }

  public async connect() {
    try {
      await this.client.connect();
      console.log('Redis Service is ready');
    } catch (err) {
      console.log({ err }, 'Redis Error');
    }
  }
  public revokedTokenPrefix(userId: string | Types.ObjectId) {
    return `user:${userId}:REVOKED_TOKEN`;
  }

  public revokedTokenKey({
    jti,
    userId,
  }: {
    jti: string;
    userId: string | Types.ObjectId;
  }) {
    return `${this.revokedTokenPrefix(userId)}:${jti}`;
  }

  public otpKey({
    userId,
    subject,
  }: {
    userId: Types.ObjectId | string;
    subject: string;
  }) {
    return `user:${userId}:OTP:${subject}`;
  }

  public otpKeyPenalty({
    userId,
    subject,
  }: {
    userId: Types.ObjectId | string;
    subject: string;
  }) {
    return `user:${userId}:OTP:${subject}:penalty`;
  }

  public otpKeyBlock({
    userId,
    subject,
  }: {
    userId: Types.ObjectId | string;
    subject: string;
  }) {
    return `user:${userId}:OTP:${subject}:block`;
  }

  public async set({
    key,
    value,
    ttl = null,
  }: {
    key: string;
    value: string | number | object;
    ttl?: number | null;
  }): Promise<string | null> {
    try {
      const data = typeof value == 'object' ? JSON.stringify(value) : value;
      const options = ttl ? { EX: ttl } : {};
      return await this.client.set(key, data, options);
    } catch (err) {
      console.log({ err }, 'Redis Error');
      return null;
    }
  }
  public async get(key: string): Promise<string | object | null> {
    try {
      return await this.client.get(key);
    } catch (err) {
      console.log({ err }, 'Redis Error');
      return null;
    }
  }

  public async del(key: string | string[]): Promise<number> {
    try {
      if (!key.length) return 0;
      return this.client.del(key);
    } catch (err) {
      console.log({ err }, 'Redis Error');
      return 0;
    }
  }

  public async exists(key: string): Promise<boolean> {
    try {
      return (await this.client.exists(key)) === 1;
    } catch (err) {
      console.log({ err }, 'Redis Error');
      return false;
    }
  }

  public async getTTL(key: string): Promise<number> {
    try {
      return await this.client.ttl(key);
    } catch (err) {
      console.log({ err }, 'Redis Error');
      return -2;
    }
  }

  public async incr(key: string): Promise<number | null> {
    try {
      return await this.client.incr(key);
    } catch (err) {
      console.log({ err }, 'Redis Error');
      return null;
    }
  }

  public FCMKey(userId: Types.ObjectId) {
    return `user:${userId}:FCM`;
  }
  public async addFCM(userId: Types.ObjectId, FCMToken: string) {
    return await this.client.sAdd(this.FCMKey(userId), FCMToken);
  }

  public async removeFCM(userId: Types.ObjectId, FCMToken: string) {
    return await this.client.sRem(this.FCMKey(userId), FCMToken);
  }

  public async getFCMs(userId: Types.ObjectId) {
    return await this.client.sMembers(this.FCMKey(userId));
  }

  public async getFCM(userId: Types.ObjectId) {
    return await this.client.sRandMember(this.FCMKey(userId));
  }

  public async hasFCMs(userId: Types.ObjectId) {
    return await this.client.sCard(this.FCMKey(userId));
  }

  public async removeFCMUser(userId: Types.ObjectId) {
    return await this.client.del(this.FCMKey(userId));
  }
}
