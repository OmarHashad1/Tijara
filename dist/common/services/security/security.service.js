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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const argon2_1 = __importDefault(require("argon2"));
const crypto_1 = require("crypto");
let SecurityService = class SecurityService {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    encrypt(text) {
        const ENCRYPTION_IV_LENGTH = Number(this.configService.get('ENCRYPTION_IV_LENGTH'));
        const ENCRYPTION_ALGORITHM = this.configService.get('ENCRYPTION_ALGORITHM');
        const ENCRYPTION_SECRET = this.configService.get('ENCRYPTION_SECRET');
        const KEY = Buffer.from(ENCRYPTION_SECRET, 'hex');
        const iv = (0, crypto_1.randomBytes)(ENCRYPTION_IV_LENGTH);
        const cipher = (0, crypto_1.createCipheriv)(ENCRYPTION_ALGORITHM, KEY, iv);
        const encrypted = Buffer.concat([
            cipher.update(text, 'utf8'),
            cipher.final(),
        ]);
        return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
    }
    decrypt(payload) {
        const ENCRYPTION_ALGORITHM = this.configService.get('ENCRYPTION_ALGORITHM');
        const ENCRYPTION_SECRET = this.configService.get('ENCRYPTION_SECRET');
        const KEY = Buffer.from(ENCRYPTION_SECRET, 'hex');
        const [ivHex, encryptedHex] = payload.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const encrypted = Buffer.from(encryptedHex, 'hex');
        const decipher = (0, crypto_1.createDecipheriv)(ENCRYPTION_ALGORITHM, KEY, iv);
        return Buffer.concat([
            decipher.update(encrypted),
            decipher.final(),
        ]).toString('utf8');
    }
    async hash(text) {
        try {
            const payload = await argon2_1.default.hash(text);
            return payload;
        }
        catch (err) {
            throw err;
        }
    }
    async verify(digest, password) {
        try {
            return await argon2_1.default.verify(digest, password);
        }
        catch (err) {
            throw err;
        }
    }
};
exports.SecurityService = SecurityService;
exports.SecurityService = SecurityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SecurityService);
//# sourceMappingURL=security.service.js.map