import { Controller, Get, Param, Query } from '@nestjs/common';
import { getSingleProduct } from '../dto/getSingleProduct.dto';
import { ListProductsQueryDto } from '../dto/listProductsQuery.dto';
import { GuestService } from './guest.service';

@Controller('products')
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  @Get()
  async listProducts(@Query() query: ListProductsQueryDto) {
    const payload = await this.guestService.listProducts(query);
    return { message: 'Products retrieved successfully', payload };
  }

  @Get('/:slug')
  async getSingleProduct(@Param() dto: getSingleProduct) {
    const payload = await this.guestService.getSingleProduct(dto);
    return { message: 'Product fetched successfully', payload };
  }
}
