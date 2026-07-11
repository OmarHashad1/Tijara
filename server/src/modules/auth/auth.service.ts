import { IUser } from '../../common/types/user.interface';
import { FlattenMaps, Types } from 'mongoose';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { UserRepo } from 'src/common/repositories';
import { ROLE } from 'src/common/enums';
import { EMAIL_EVENTS } from 'src/common/enums/email.enums';
import { TokenService } from 'src/common/services/token';
import { SecurityService } from 'src/common/services/security';
import { OtpService } from 'src/common/services/otp';
import { IDecodedToken } from 'src/common/types';
import { emailEmitter } from 'src/common/events/email.event';
import { ForgotPassword } from './dto/resetPassword.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly tokenService: TokenService,
    private readonly securityService: SecurityService,
    private readonly otpService: OtpService,
  ) {}

  private async findUser(email: string) {
    const user = await this.userRepo.findOne({
      filter: { email: email },
      projection: {
        email: 1,
        _id: 1,
        firstName: 1,
        password: 1,
        oldPasswords: 1,
      },
      options: { lean: false },
    });
    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      filter: { email: dto.email },
      options: { lean: false, paranoId: false },
      projection: { _id: 1, email: 1, role: 1, password: 1 },
    });
    if (
      !user ||
      !user.password ||
      !(await this.securityService.verify(user.password, dto.password))
    )
      throw new BadRequestException('Wrong email or password');
    const { _id, email, role } = user;
    const token = await this.tokenService.generateToken({
      payload: { _id, email, role },
    });

    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens({
        _id: user._id,
        email: user.email,
        role: user.role,
      });
    return {
      accessToken,
      refreshToken,
    };
  }

  async signup(dto: SignupDto) {
    const existing = await this.userRepo.findOne({
      filter: { email: dto.email },
      projection: { _id: 1 },
      options: { lean: true },
    });

    if (existing) throw new ConflictException('Email is already in use');

    const user = await this.userRepo.create({
      data: { ...dto, role: ROLE.USER },
    });

    return {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };
  }

  async refreshToken(user: IUser, decoded: IDecodedToken) {
    const accessToken = await this.tokenService.generateToken({
      payload: {
        _id: Types.ObjectId.createFromHexString(decoded._id),
        email: user.email,
        role: user.role,
      },
      options: {
        jwtid: decoded.jti,
        expiresIn: '30M',
      },
    });

    return accessToken;
  }

  async sendVerifyEmailOTP(
    userId: Types.ObjectId,
    email: string,
    firstName: string,
  ) {
    const otp = await this.otpService.send(userId, EMAIL_EVENTS.VERIFY_EMAIL);
    emailEmitter.emit(EMAIL_EVENTS.VERIFY_EMAIL, { to: email, firstName, otp });
  }

  async checkVerifyEmailOTP(userId: Types.ObjectId, otp: string) {
    await this.otpService.verify(userId, EMAIL_EVENTS.VERIFY_EMAIL, otp);
    await this.userRepo.updateOne({
      filter: { _id: userId },
      update: { $set: { isEmailVerified: true } },
    });
  }

  async sendForgotPasswordOTP(email: string) {
    const user = await this.findUser(email);
    if (!user) return;

    const otp = await this.otpService.send(
      user._id,
      EMAIL_EVENTS.FORGOT_PASSWORD,
    );
    emailEmitter.emit(EMAIL_EVENTS.FORGOT_PASSWORD, {
      to: user.email,
      firstName: user.firstName,
      otp,
    });
  }
  async verifyForgotPasswordOTP(email: string, otp: string) {
    const user = await this.findUser(email);
    if (!user) return;
    await this.otpService.verify(user._id, EMAIL_EVENTS.FORGOT_PASSWORD, otp);
  }

  async resetPassword(dto: ForgotPassword) {
    const user = await this.findUser(dto.email);
    if (!user) throw new NotFoundException('User not found');

    for (const old of user.oldPasswords ?? []) {
      if (await this.securityService.verify(old, dto.newPassword))
        throw new BadRequestException('Password was used before');
    }

    await this.otpService.consume(user._id, EMAIL_EVENTS.FORGOT_PASSWORD);

    await this.userRepo.updateOne({
      filter: { _id: user._id, email: dto.email },
      update: {
        $set: {
          password: await this.securityService.hash(dto.newPassword),
          credentialsChangedAt: new Date(),
        },
        $push: { oldPasswords: user.password },
      },
    });
  }
}
