import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { AdminService } from './admin.service';
import { ROLE } from 'src/common/enums';
import { Auth } from 'src/common/decorators';
import { ParseObjectIdPipe } from 'src/common/pipes';
import { BanUserDto } from '../dto/ban-user.dto';
import { ListUsersQueryDto } from '../dto/list-users-query.dto';

@Controller('admin/users')
@Auth([ROLE.ADMIN])
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  listUsers(@Query() query: ListUsersQueryDto) {
    return this.adminService.listUsers(query);
  }

  @Get(':id')
  getUser(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.adminService.getUser(id);
  }

  @Patch(':id/ban')
  @HttpCode(HttpStatus.OK)
  banUser(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() dto: BanUserDto,
  ) {
    return this.adminService.banUser(id, dto);
  }

  @Patch(':id/unban')
  @HttpCode(HttpStatus.OK)
  unbanUser(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.adminService.unbanUser(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  softDeleteUser(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.adminService.softDeleteUser(id);
  }

  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  restoreUser(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.adminService.restoreUser(id);
  }
}
