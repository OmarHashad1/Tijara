import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ROLE } from 'src/common/enums';
import { Auth } from 'src/common/decorators';
import { User } from 'src/common/decorators';
import { type IUser } from 'src/common/types';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadPhoto } from 'src/common/utils/multer.util';
import { type Request } from 'express';
import { LogoutDto } from './dto/logout.dto';

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

  @Post('/logout')
  async logout(@Req() req: Request, @Body() dto: LogoutDto) {
    try {
      const { user, decoded } = req.credentials;
      await this.userService.logout({ type: dto.type, user, decoded });
    } catch (err) {
      throw err;
    }
  }

  @Post('/upload-file')
  @UseInterceptors(FileInterceptor('photo', uploadPhoto))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }
}
