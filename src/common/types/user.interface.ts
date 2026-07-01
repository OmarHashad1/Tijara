import { Types } from 'mongoose';
import { PAYMENT_METHOD, ROLE } from 'src/common/enums';

export interface IUserLocation {
  city?: string | null;
  country?: string | null;
}

export interface IUserAddress {
  city: string;
  country: string;
  isDefault: boolean;
}

export interface IUseraPayment {
  method: PAYMENT_METHOD;
  last4: number;
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
  paymentsMethod?: IUseraPayment[] | null;
  updatedAt?: Date;
  deletedAt: Date | null;
  restoredAt: Date | null;
  username?: string;
}
