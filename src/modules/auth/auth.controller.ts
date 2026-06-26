import {
  Body,
  ConflictException,
  Controller,
  Post,
  Req,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { type Response, type Request } from 'express';
import {
  ACCESS_COOKIE_OPTION,
  REFRESH_COOKIE_OPTION,
} from 'src/configs/cookie.config';

@Controller('auth')

export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

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
}
