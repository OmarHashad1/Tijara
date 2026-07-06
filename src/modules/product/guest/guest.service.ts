import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { ProductRepo } from 'src/common/repositories/product.repo';
import { ListProductsQueryDto } from '../dto/listProductsQuery.dto';

@Injectable()
export class GuestService {
  constructor(private readonly productRepo: ProductRepo) {}

  async listProducts(query: ListProductsQueryDto) {
    const {
      search,
      categoryId,
      brandId,
      minPrice,
      maxPrice,
      page = 1,
      size = 20,
    } = query;
    const filter: Record<string, unknown> = {};

    if (search) filter.name = { $regex: search, $options: 'i' };
    if (categoryId) filter.categoryId = new Types.ObjectId(categoryId);
    if (brandId) filter.brandId = new Types.ObjectId(brandId);
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {
        ...(minPrice !== undefined ? { $gte: minPrice } : {}),
        ...(maxPrice !== undefined ? { $lte: maxPrice } : {}),
      };
    }

    return this.productRepo.paginate({ filter, options: {}, page, size });
  }

  async getSingleProduct({ slug }: { slug: string }) {
    const product = await this.productRepo.findOne({
      filter: { slug },
      options: { lean: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }
}
