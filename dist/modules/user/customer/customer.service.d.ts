import { Types } from 'mongoose';
import { UserDocument } from "../../../models";
import { UserRepo } from "../../../common/repositories";
import { RedisService } from "../../../common/services/redis";
import { SecurityService } from "../../../common/services/security";
import { IDecodedToken, LOGOUT_TYPE } from "../../../common/types";
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { AddAddressDto } from '../dto/add-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { AddPaymentMethodDto } from '../dto/add-payment-method.dto';
export declare class CustomerService {
    private readonly userRepo;
    private readonly redisService;
    private readonly securityService;
    constructor(userRepo: UserRepo, redisService: RedisService, securityService: SecurityService);
    logout({ type, user, decoded, }: {
        type: LOGOUT_TYPE;
        user: UserDocument;
        decoded: IDecodedToken;
    }): Promise<void>;
    updateProfile(userId: Types.ObjectId, dto: UpdateProfileDto): Promise<void>;
    changePassword(userId: Types.ObjectId, dto: ChangePasswordDto): Promise<void>;
    getAddresses(userId: Types.ObjectId): Promise<import("mongoose").FlattenMaps<import("server/src/common/types").IUserAddress>[]>;
    addAddress(userId: Types.ObjectId, dto: AddAddressDto): Promise<void>;
    updateAddress(userId: Types.ObjectId, addressId: Types.ObjectId, dto: UpdateAddressDto): Promise<void>;
    deleteAddress(userId: Types.ObjectId, addressId: Types.ObjectId): Promise<void>;
    getPaymentMethods(userId: Types.ObjectId): Promise<import("mongoose").FlattenMaps<import("server/src/common/types").IUseraPayment>[]>;
    addPaymentMethod(userId: Types.ObjectId, dto: AddPaymentMethodDto): Promise<void>;
    deleteAccount(userId: Types.ObjectId): Promise<void>;
    deletePaymentMethod(userId: Types.ObjectId, paymentId: Types.ObjectId): Promise<void>;
}
