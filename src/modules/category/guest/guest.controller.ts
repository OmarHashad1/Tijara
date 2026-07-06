import { Controller, Get, Param } from '@nestjs/common';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from 'src/common/pipes';
import { GuestService } from './guest.service';
import { getSingleCategory } from '../dto/getSingleCategory.dto';

@Controller('categories')
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  @Get()
  async listCategories() {
    const payload = await this.guestService.listCategories();
    return { message: 'Categories retrieved successfully', payload };
  }

  @Get('/:slug')
  async getSingleCategory(@Param() dto: getSingleCategory) {
    const payload = await this.guestService.getSingleCategory(dto);

    return { message: 'Category fetcehd successfully', payload };
  }

  @Get(':id/brands')
  async listCategoryBrands(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    const payload = await this.guestService.listCategoryBrands(id);
    return { message: 'Brands retrieved successfully', payload };
  }
}
