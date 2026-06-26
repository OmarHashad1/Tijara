import { Document, Types } from 'mongoose';
import { ROLE } from 'src/enums';

export interface IUserLocation {
  city?: string | null;
  country?: string | null;
}

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string | null;
  oldPasswords: string[];
  googleId: string | null;
  provider: string;
  role: ROLE;
  DOB: Date;
  age: number | null;
  avatar?: string | null;
  phoneNumber?: string | null;
  location?: IUserLocation | null;
  isEmailVerified: boolean;
  status: string;
  credentialsChangedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt: Date | null;
  username?: string;
}
