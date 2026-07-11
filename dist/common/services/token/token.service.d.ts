import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IDecodeTokenParams, IGenerateTokenParams, ITokenPayload, IVerifyTokenParams } from "../../types";
export declare class TokenService {
    private readonly jwtService;
    private readonly configService;
    constructor(jwtService: JwtService, configService: ConfigService);
    generateToken({ payload, options, type, }: IGenerateTokenParams): Promise<string>;
    verifyToken({ role, type, token, }: IVerifyTokenParams): Promise<any>;
    decodeToken({ token, type }: IDecodeTokenParams): Promise<{
        _id: string;
        jti: string;
        iat: number;
    }>;
    generateTokens: ({ _id, email, role }: ITokenPayload) => Promise<{
        refreshToken: string;
        accessToken: string;
    }>;
}
