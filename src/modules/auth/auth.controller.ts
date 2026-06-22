import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  ParseIntPipe,
  Post,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { type Response as expressResponse } from 'express';
import { LoginDto } from './dto/login.dto';
import { SingupDto } from './dto/signup.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(
    @Res({ passthrough: true }) res: expressResponse,
    @Body(
      new ValidationPipe({
        stopAtFirstError: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    dto: LoginDto,
  ) {
    this.authService.login();
    res.status(HttpStatus.OK).json({ message: dto });
  }

  @Post('/signup')
  signup(
    @Body("age", ParseIntPipe)age:number,
    @Body(
      new ValidationPipe({
        stopAtFirstError: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    dto: SingupDto,
    @Res({ passthrough: true }) res: expressResponse,
  ) {
    res.status(HttpStatus.CREATED).json(dto);
  }
}
