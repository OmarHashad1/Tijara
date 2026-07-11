import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { type Response, type Request } from 'express';
import { ForgotPasswordOtp } from './dto/forgotPasswordOtp.dto';
import { verfiyForgotPasswordOtp } from './dto/verifyForgotPasswordOtp.dto';
import { ForgotPassword } from './dto/resetPassword.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(req: Request, dto: LoginDto, res: Response): Promise<{
        message: string;
    }>;
    signup(req: Request, dto: SignupDto): Promise<{
        message: string;
        payload: {
            id: import("mongoose").Types.ObjectId;
            firstName: string;
            lastName: string;
            email: string;
            role: import("../../common/enums").ROLE;
        };
    }>;
    refreshToken(req: Request, res: Response): Promise<{}>;
    sendVerifyEmailOTP(req: Request): Promise<{
        message: string;
    }>;
    checkVerifyEmailOTP(req: Request, dto: VerifyOtpDto): Promise<{
        message: string;
    }>;
    sendForgotPasswordOTP(dto: ForgotPasswordOtp): Promise<{
        message: string;
    }>;
    verfiyForgotPasswordOtp(dto: verfiyForgotPasswordOtp): Promise<{
        message: string;
    }>;
    resetPassword(dto: ForgotPassword): Promise<{
        message: string;
    }>;
}
