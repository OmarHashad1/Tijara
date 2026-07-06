import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { Auth } from 'src/common/decorators';
import { ROLE } from 'src/common/enums';
import { ParseObjectIdPipe } from 'src/common/pipes';
import { CreateCategoryDto } from '../dto/createCategory.dto';
import { UpdateCategoryDto } from '../dto/updateCategory.dto';
import { AdminService } from './admin.service';

@Controller('admin/categories')
@Auth([ROLE.ADMIN])
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  async createCategory(@Body() dto: CreateCategoryDto) {
    const payload = await this.adminService.createCategory(dto);
    return { message: 'Category created successfully', payload };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateCategory(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() dto: UpdateCategoryDto,
  ) {
    const payload = await this.adminService.updateCategory(id, dto);
    return { message: 'Category updated successfully', payload };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteCategory(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    await this.adminService.deleteCategory(id);
    return { message: 'Category deleted successfully' };
  }
}
