import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';
import { Auth } from 'src/common/decorators';
import { ROLE } from 'src/common/enums';
import { ParseObjectIdPipe } from 'src/common/pipes';
import { uploadProductImages } from 'src/common/utils/multer.util';
import { CreateProductDto } from '../dto/createProduct.dto';
import { UpdateProductDto } from '../dto/updateProduct.dto';
import { AdjustStockDto } from '../dto/adjustStock.dto';
import { AdminService } from './admin.service';

const MAX_PRODUCT_IMAGES = 10;

@Controller('admin/products')
@Auth([ROLE.ADMIN])
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', MAX_PRODUCT_IMAGES, uploadProductImages),
  )
  async createProduct(
    @Body() dto: CreateProductDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    const payload = await this.adminService.createProduct(dto, images);
    return { message: 'Product created successfully', payload };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FilesInterceptor('images', MAX_PRODUCT_IMAGES, uploadProductImages),
  )
  async updateProduct(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() dto: UpdateProductDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    const payload = await this.adminService.updateProduct(id, dto, images);
    return { message: 'Product updated successfully', payload };
  }

  @Patch(':id/stock')
  @HttpCode(HttpStatus.OK)
  async adjustStock(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() dto: AdjustStockDto,
  ) {
    const payload = await this.adminService.adjustStock(id, dto);
    return { message: 'Stock updated successfully', payload };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteProduct(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    await this.adminService.deleteProduct(id);
    return { message: 'Product deleted successfully' };
  }
}
