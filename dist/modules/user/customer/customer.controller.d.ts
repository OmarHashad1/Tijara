import { CustomerService } from './customer.service';
import { type IUser } from "../../../common/types";
import { type Request } from 'express';
import { type UserDocument } from "../../../models";
import { LogoutDto } from '../dto/logout.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { AddAddressDto } from '../dto/add-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { AddPaymentMethodDto } from '../dto/add-payment-method.dto';
export declare class CustomerController {
    private readonly customerService;
    constructor(customerService: CustomerService);
    profile(user: IUser): {
        message: string;
        data: IUser;
    };
    updateProfile(user: UserDocument, dto: UpdateProfileDto): Promise<{
        message: string;
    }>;
    changePassword(user: UserDocument, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    getAddresses(user: UserDocument): Promise<{
        message: string;
        data: import("mongoose").FlattenMaps<import("server/src/common/types").IUserAddress>[];
    }>;
    addAddress(user: UserDocument, dto: AddAddressDto): Promise<{
        message: string;
    }>;
    updateAddress(user: UserDocument, id: string, dto: UpdateAddressDto): Promise<{
        message: string;
    }>;
    deleteAddress(user: UserDocument, id: string): Promise<{
        message: string;
    }>;
    getPaymentMethods(user: UserDocument): Promise<{
        message: string;
        data: import("mongoose").FlattenMaps<import("server/src/common/types").IUseraPayment>[];
    }>;
    addPaymentMethod(user: UserDocument, dto: AddPaymentMethodDto): Promise<{
        message: string;
    }>;
    deletePaymentMethod(user: UserDocument, id: string): Promise<{
        message: string;
    }>;
    deleteAccount(user: UserDocument): Promise<{
        message: string;
    }>;
    logout(req: Request, dto: LogoutDto): Promise<{
        message: string;
    }>;
}
