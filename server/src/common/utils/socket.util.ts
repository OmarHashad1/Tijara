import { parseCookie } from 'cookie';
import { TOKEN_TYPE } from '../enums/auth.enum';
import { AuthSocket } from '../types';
import { ForbiddenException } from '@nestjs/common';

export const getToken = (
  client: AuthSocket,
  type: TOKEN_TYPE = TOKEN_TYPE.ACCESS,
) => {
  const rawCookie = client.handshake.headers.cookie;
  if (!rawCookie) {
    throw new ForbiddenException('Invalid or expired token');
  }
  const cookie = parseCookie(rawCookie as string) as unknown as {
    accessToken: string;
    refreshToken: string;
  };
  const token =
    type == TOKEN_TYPE.ACCESS
      ? (cookie.accessToken as string)
      : (cookie.refreshToken as string);

  return token;
};
