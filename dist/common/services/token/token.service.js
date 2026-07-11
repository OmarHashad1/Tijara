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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const enums_1 = require("../../enums");
const nanoid_1 = require("nanoid");
const auth_enum_1 = require("../../enums/auth.enum");
let TokenService = class TokenService {
    jwtService;
    configService;
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async generateToken({ payload, options = {}, type = auth_enum_1.TOKEN_TYPE.ACCESS, }) {
        const secret = this.configService.get(`tokens.${payload.role}.${type}`);
        if (!secret) {
            throw new common_1.InternalServerErrorException('Invalid token or user type');
        }
        try {
            return await this.jwtService.signAsync(payload, { ...options, secret });
        }
        catch (err) {
            throw new common_1.InternalServerErrorException('Failed to generate token', {
                cause: err,
            });
        }
    }
    async verifyToken({ role = enums_1.ROLE.USER, type = auth_enum_1.TOKEN_TYPE.ACCESS, token, }) {
        const secret = this.configService.get(`tokens.${role}.${type}`);
        if (!secret) {
            throw new common_1.InternalServerErrorException('Invalid token or user type');
        }
        try {
            return await this.jwtService.verifyAsync(token, { secret });
        }
        catch (err) {
            throw new common_1.UnauthorizedException('Invalid or expired token', {
                cause: err,
            });
        }
    }
    async decodeToken({ token, type = auth_enum_1.TOKEN_TYPE.ACCESS }) {
        try {
            const decoded = this.jwtService.decode(token);
            if (!decoded?.role) {
                throw new common_1.UnauthorizedException('Invalid or expired token');
            }
            const jwtPayload = (await this.verifyToken({
                role: decoded.role,
                type,
                token,
            }));
            return {
                _id: jwtPayload._id,
                jti: jwtPayload.jti,
                iat: jwtPayload.iat,
            };
        }
        catch (err) {
            throw err;
        }
    }
    generateTokens = async ({ _id, email, role }) => {
        const jti = (0, nanoid_1.nanoid)(25);
        const accessToken = await this.generateToken({
            payload: {
                _id: _id,
                email: email,
                role: role,
            },
            options: {
                jwtid: jti,
                expiresIn: '30M',
            },
        });
        const refreshToken = await this.generateToken({
            type: auth_enum_1.TOKEN_TYPE.REFRESH,
            payload: {
                _id: _id,
                email: email,
                role: role,
            },
            options: {
                jwtid: jti,
                expiresIn: '1W',
            },
        });
        return { refreshToken, accessToken };
    };
};
exports.TokenService = TokenService;
exports.TokenService = TokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], TokenService);
//# sourceMappingURL=token.service.js.map