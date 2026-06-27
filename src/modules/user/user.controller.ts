import { Controller, Get, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { type Request } from 'express';
import { UserService } from './user.service';
import { ROLE } from 'src/enums';
import { Auth } from 'src/decorators';
import { User } from 'src/decorators';
import { type IUser } from 'src/types';
import { delay, of } from 'rxjs';

@Controller('user')
@Auth([ROLE.USER])
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/me')
  profile(@User() user: IUser) {
    return {
      message: 'User profile fetched successfully',
      data: user,
    };
  }
}
