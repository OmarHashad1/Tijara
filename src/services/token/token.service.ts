import { ConfigService } from '@nestjs/config';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  IDecodeTokenParams,
  IGenerateTokenParams,
  ITokenPayload,
  IVerifyTokenParams,
} from 'src/types';
import { ROLE } from 'src/enums';
import { UserRepo } from 'src/repositories';
import { nanoid } from 'nanoid';
import { TOKEN_TYPE } from 'src/enums/auth.enum';
@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateToken({
    payload,
    options = {},
    type = TOKEN_TYPE.ACCESS,
  }: IGenerateTokenParams): Promise<string> {
    const secret = this.configService.get<string>(
      `tokens.${payload.role}.${type}`,
    );
    if (!secret) {
      throw new InternalServerErrorException('Invalid token or user type');
    }
    try {
      return await this.jwtService.signAsync(payload, { ...options, secret });
    } catch (err) {
      throw new InternalServerErrorException('Failed to generate token', {
        cause: err,
      });
    }
  }
  async verifyToken({
    role = ROLE.USER,
    type = TOKEN_TYPE.ACCESS,
    token,
  }: IVerifyTokenParams) {
    const secret = this.configService.get<string>(`tokens.${role}.${type}`);
    if (!secret) {
      throw new InternalServerErrorException('Invalid token or user type');
    }
    try {
      return await this.jwtService.verifyAsync(token, { secret });
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token', {
        cause: err,
      });
    }
  }
  async decodeToken({ token, type = TOKEN_TYPE.ACCESS }: IDecodeTokenParams) {
    try {
      const decoded = this.jwtService.decode(token);

      if (!decoded?.role) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      const jwtPayload = (await this.verifyToken({
        role: decoded.role,
        type,
        token,
      })) as unknown as {
        _id: string;
        jti: string;
        email: string;
        iat: number;
        role: ROLE;
      };
      return {
        _id: jwtPayload._id,
        jti: jwtPayload.jti,
        iat: jwtPayload.iat,
      };
    } catch (err) {
      throw err;
    }
  }
  generateTokens = async ({ _id, email, role }: ITokenPayload) => {
    const jti = nanoid(25);

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
      type: TOKEN_TYPE.REFRESH,
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
}
