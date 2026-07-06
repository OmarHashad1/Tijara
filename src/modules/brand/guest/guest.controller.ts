import { Controller, Get, Param } from '@nestjs/common';
import { getSingleBrand } from '../dto/getSingleBrand.dto';
import { GuestService } from './guest.service';

@Controller('brands')
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  @Get()
  async listBrands() {
    const payload = await this.guestService.listBrands();
    return { message: 'Brands retrieved successfully', payload };
  }

  @Get('/:slug')
  async getSingleBrand(@Param() dto: getSingleBrand) {
    const payload = await this.guestService.getSingleBrand(dto);
    return { message: 'Brand fetched successfully', payload };
  }
}
