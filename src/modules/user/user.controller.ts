import { Controller, Get, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { type Request } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserService } from './user.service';
import { TOKEN_TYPE } from 'src/enums/auth.enums';
import { Token } from 'src/decorators/token.decorator';

@Controller('user')
@UseGuards(AuthGuard)
@Token(TOKEN_TYPE.ACCESS)
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/me')
  profile(@Req() req: Request) {
    return {
      message: 'User profile fetched successfully',
      data: req.credentials.user,
    };
  }
}
