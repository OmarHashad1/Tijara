import { IUser } from './../../types/user.interface';
import { FlattenMaps, Types } from 'mongoose';
import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { UserRepo } from 'src/repositories';
import { ROLE } from 'src/enums';
import { TokenService } from 'src/common/services/token';
import { SecurityService } from 'src/common/services/security';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly tokenService: TokenService,
    private readonly securityService: SecurityService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      filter: { email: dto.email },
      options: { lean: false },
      projection: { _id: 1, email: 1, role: 1, password: 1 },
    });

    if (
      !user ||
      !user.password ||
      !(await this.securityService.verify(user.password, dto.password))
    )
      throw new BadRequestException('wrong email or password');
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
}
