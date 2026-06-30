import {
  Body,
  ConflictException,
  Controller,
  Post,
  Req,
  Res,
  SetMetadata,
  UseGuards,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { type Response, type Request } from 'express';
import {
  ACCESS_COOKIE_OPTION,
  REFRESH_COOKIE_OPTION,
} from 'src/configs/cookie.config';
import { AuthenticationGuard } from 'src/common/guards/auth';
import { TOKEN_TYPE } from 'src/common/enums/auth.enum';
import { Auth } from 'src/common/decorators';
import { ROLE } from 'src/common/enums';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(
    @Req() req: Request,

    @Body()
    dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { accessToken, refreshToken } = await this.authService.login(
        dto as LoginDto,
      );

      res.cookie('accessToken', accessToken, ACCESS_COOKIE_OPTION);
      res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTION);
      return {
        message: 'Logged in successfully!',
      };
    } catch (err) {
      throw err;
    }
  }

  @Post('/signup')
  async signup(
    @Req() req: Request,
    @Body(
      new ValidationPipe({
        stopAtFirstError: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    dto: SignupDto,
  ) {
    try {
      const payload = await this.authService.signup(dto as SignupDto);
      return { message: 'User created successfully', payload };
    } catch (err: any) {
      if (err?.code === 11000)
        throw new ConflictException('Email already in use');

      throw err;
    }
  }

  @Post('/refresh-token')
  @UseGuards(AuthenticationGuard)
  @SetMetadata('tokenType', TOKEN_TYPE.REFRESH)
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { user, decoded } = req.credentials;
      const accessToken = await this.authService.refreshToken(user, decoded);
      res.cookie('accessToken', accessToken, ACCESS_COOKIE_OPTION);
      return {};
    } catch (err) {
      throw err;
    }
  }

  @Post('/send-verify-email')
  @Auth([ROLE.USER])
  @HttpCode(HttpStatus.OK)
  async sendVerifyEmailOTP(@Req() req: Request) {
    const { user } = req.credentials;
    if (user.isEmailVerified)
      throw new BadRequestException('User email is already verified');
    await this.authService.sendVerifyEmailOTP(
      user._id,
      user.email,
      user.firstName,
    );
    return { message: 'Verification code sent to your email' };
  }

  @Post('/check-verify-email')
  @Auth([ROLE.USER])
  @HttpCode(HttpStatus.OK)
  async checkVerifyEmailOTP(
    @Req() req: Request,
    @Body(new ValidationPipe({ stopAtFirstError: true, whitelist: true }))
    dto: VerifyOtpDto,
  ) {
    const { user } = req.credentials;
    await this.authService.checkVerifyEmailOTP(user._id, dto.otp);
    return { message: 'Email verified successfully' };
  }
}
