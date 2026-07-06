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
import { CreateBrandDto } from '../dto/createBrand.dto';
import { UpdateBrandDto } from '../dto/updateBrand.dto';
import { AdminService } from './admin.service';

@Controller('admin/brands')
@Auth([ROLE.ADMIN])
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  async createBrand(@Body() dto: CreateBrandDto) {
    const payload = await this.adminService.createBrand(dto);
    return { message: 'Brand created successfully', payload };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateBrand(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() dto: UpdateBrandDto,
  ) {
    const payload = await this.adminService.updateBrand(id, dto);
    return { message: 'Brand updated successfully', payload };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteBrand(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    await this.adminService.deleteBrand(id);
    return { message: 'Brand deleted successfully' };
  }
}
