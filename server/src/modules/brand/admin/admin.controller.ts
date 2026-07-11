import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';
import { Auth } from 'src/common/decorators';
import { ROLE } from 'src/common/enums';
import { ParseObjectIdPipe } from 'src/common/pipes';
import { uploadBrandLogo } from 'src/common/utils/multer.util';
import { CreateBrandDto } from '../dto/createBrand.dto';
import { UpdateBrandDto } from '../dto/updateBrand.dto';
import { AdminService } from './admin.service';

@Controller('admin/brands')
@Auth([ROLE.ADMIN])
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @UseInterceptors(FileInterceptor('logo', uploadBrandLogo))
  async createBrand(
    @Body() dto: CreateBrandDto,
    @UploadedFile() logo?: Express.Multer.File,
  ) {
    const payload = await this.adminService.createBrand(dto, logo);
    return { message: 'Brand created successfully', payload };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('logo', uploadBrandLogo))
  async updateBrand(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() dto: UpdateBrandDto,
    @UploadedFile() logo?: Express.Multer.File,
  ) {
    const payload = await this.adminService.updateBrand(id, dto, logo);
    return { message: 'Brand updated successfully', payload };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteBrand(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    await this.adminService.deleteBrand(id);
    return { message: 'Brand deleted successfully' };
  }
}
