import { IUser } from '../../common/types/user.interface';
import { Types } from 'mongoose';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { UserRepo } from "../../common/repositories";
import { ROLE } from "../../common/enums";
import { TokenService } from "../../common/services/token";
import { SecurityService } from "../../common/services/security";
import { OtpService } from "../../common/services/otp";
import { IDecodedToken } from "../../common/types";
import { ForgotPassword } from './dto/resetPassword.dto';
export declare class AuthService {
    private readonly userRepo;
    private readonly tokenService;
    private readonly securityService;
    private readonly otpService;
    constructor(userRepo: UserRepo, tokenService: TokenService, securityService: SecurityService, otpService: OtpService);
    private findUser;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    signup(dto: SignupDto): Promise<{
        id: Types.ObjectId;
        firstName: string;
        lastName: string;
        email: string;
        role: ROLE;
    }>;
    refreshToken(user: IUser, decoded: IDecodedToken): Promise<string>;
    sendVerifyEmailOTP(userId: Types.ObjectId, email: string, firstName: string): Promise<void>;
    checkVerifyEmailOTP(userId: Types.ObjectId, otp: string): Promise<void>;
    sendForgotPasswordOTP(email: string): Promise<void>;
    verifyForgotPasswordOTP(email: string, otp: string): Promise<void>;
    resetPassword(dto: ForgotPassword): Promise<void>;
}
