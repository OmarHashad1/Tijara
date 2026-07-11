import { Controller, Get, Param } from '@nestjs/common';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from 'src/common/pipes';
import { GuestService } from './guest.service';

@Controller('categories')
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  @Get(':id/brands')
  async listCategoryBrands(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    const payload = await this.guestService.listCategoryBrands(id);
    return { message: 'Brands retrieved successfully', payload };
  }
}
