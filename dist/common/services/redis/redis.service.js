"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
let RedisService = class RedisService {
    client;
    constructor(client) {
        this.client = client;
        this.handleEvents();
    }
    handleEvents() {
        this.client.on('error', (err) => console.log(err));
        this.client.on('ready', () => console.log('Redis Is Connected'));
    }
    async connect() {
        try {
            await this.client.connect();
            console.log('Redis Service is ready');
        }
        catch (err) {
            console.log({ err }, 'Redis Error');
        }
    }
    revokedTokenPrefix(userId) {
        return `user:${userId}:REVOKED_TOKEN`;
    }
    revokedTokenKey({ jti, userId, }) {
        return `${this.revokedTokenPrefix(userId)}:${jti}`;
    }
    otpKey({ userId, subject, }) {
        return `user:${userId}:OTP:${subject}`;
    }
    otpKeyPenalty({ userId, subject, }) {
        return `user:${userId}:OTP:${subject}:penalty`;
    }
    otpKeyBlock({ userId, subject, }) {
        return `user:${userId}:OTP:${subject}:block`;
    }
    async set({ key, value, ttl = null, }) {
        try {
            const data = typeof value == 'object' ? JSON.stringify(value) : value;
            const options = ttl ? { EX: ttl } : {};
            return await this.client.set(key, data, options);
        }
        catch (err) {
            console.log({ err }, 'Redis Error');
            return null;
        }
    }
    async get(key) {
        try {
            return await this.client.get(key);
        }
        catch (err) {
            console.log({ err }, 'Redis Error');
            return null;
        }
    }
    async del(key) {
        try {
            if (!key.length)
                return 0;
            return this.client.del(key);
        }
        catch (err) {
            console.log({ err }, 'Redis Error');
            return 0;
        }
    }
    async exists(key) {
        try {
            return (await this.client.exists(key)) === 1;
        }
        catch (err) {
            console.log({ err }, 'Redis Error');
            return false;
        }
    }
    async getTTL(key) {
        try {
            return await this.client.ttl(key);
        }
        catch (err) {
            console.log({ err }, 'Redis Error');
            return -2;
        }
    }
    async incr(key) {
        try {
            return await this.client.incr(key);
        }
        catch (err) {
            console.log({ err }, 'Redis Error');
            return null;
        }
    }
    CahcedKey(value, userId = null) {
        return userId ? `REQUEST::${value}::${userId}` : `REQUEST::${value}`;
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('REDIS')),
    __metadata("design:paramtypes", [Object])
], RedisService);
//# sourceMappingURL=redis.service.js.map