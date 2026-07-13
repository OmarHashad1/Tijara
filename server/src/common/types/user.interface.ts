import { Types } from 'mongoose';
import { ROLE } from 'src/common/enums';

export interface IUserLocation {
  city?: string | null;
  country?: string | null;
}

export interface IUserAddress {
  _id?: Types.ObjectId;
  city: string;
  country: string;
  isDefault: boolean;
}

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string | null;
  oldPasswords: string[];
  role: ROLE;
  phoneNumber?: string | null;
  isEmailVerified: boolean;
  status: string;
  credentialsChangedAt: Date | null;
  createdAt?: Date;
  addresses?: IUserAddress[] | null;
  updatedAt?: Date;
  deletedAt: Date | null;
  restoredAt: Date | null;
  banReason?: string | null;
  username?: string;
  _id?: Types.ObjectId;
}
