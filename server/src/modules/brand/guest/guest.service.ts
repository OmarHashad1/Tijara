import { Injectable, NotFoundException } from '@nestjs/common';
import { BrandRepo } from 'src/common/repositories/brand.repo';

@Injectable()
export class GuestService {
  constructor(private readonly brandRepo: BrandRepo) {}

  async listBrands() {
    return this.brandRepo.find({ filter: {}, options: { lean: true } });
  }

  async getSingleBrand({ slug }: { slug: string }) {
    const brand = await this.brandRepo.findOne({
      filter: { slug },
      options: { lean: true },
    });
    if (!brand) throw new NotFoundException('Brand not found');
    return brand;
  }
}
