import { IDecodedToken } from './auth.interface';
import { IUser } from './user.interface';

declare global {
  namespace Express {
    interface Request {
      requestedAt: Date;
      credentials: {
        user: IUser;
        decoded: IDecodedToken;
      };
    }
  }
}

export {};
