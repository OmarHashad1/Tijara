import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ROLE } from 'src/enums';
import { Auth } from 'src/decorators';
import { User } from 'src/decorators';
import { type IUser } from 'src/types';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadPhoto } from 'src/utils/multer.util';

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

  @Post('/upload-file')
  @UseInterceptors(FileInterceptor('photo', uploadPhoto))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }
}
