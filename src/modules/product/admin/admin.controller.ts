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
import { CreateProductDto } from '../dto/createProduct.dto';
import { UpdateProductDto } from '../dto/updateProduct.dto';
import { AdjustStockDto } from '../dto/adjustStock.dto';
import { AdminService } from './admin.service';

@Controller('admin/products')
@Auth([ROLE.ADMIN])
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  async createProduct(@Body() dto: CreateProductDto) {
    const payload = await this.adminService.createProduct(dto);
    return { message: 'Product created successfully', payload };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateProduct(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() dto: UpdateProductDto,
  ) {
    const payload = await this.adminService.updateProduct(id, dto);
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
