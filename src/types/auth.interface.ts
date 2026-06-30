import { JwtSignOptions } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { ROLE } from 'src/enums';
import { TOKEN_TYPE } from 'src/enums/auth.enum';

export interface ITokenPayload {
  _id: Types.ObjectId;
  email: string;
  role: ROLE;
}

export interface IGenerateTokenParams {
  type?: TOKEN_TYPE;
  payload: ITokenPayload;
  options?: JwtSignOptions | undefined;
}

export interface IVerifyTokenParams {
  role: ROLE;
  type: TOKEN_TYPE;
  token: string;
}

export interface IDecodeTokenParams {
  type?: TOKEN_TYPE;
  token: string;
}

export interface IDecodedToken {
  _id: string;
  jti: string;
  iat: number;
}
