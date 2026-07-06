import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { CATEGORY_STATUS } from 'src/common/enums';
import { BrandRepo } from 'src/common/repositories/brand.repo';
import { CategoryRepo } from 'src/common/repositories/category.repo';

@Injectable()
export class GuestService {
  constructor(
    private readonly categoryRepo: CategoryRepo,
    private readonly brandRepo: BrandRepo,
  ) {}

  async listCategories() {
    return this.categoryRepo.find({
      filter: { status: CATEGORY_STATUS.PUBLISHED },
      options: { lean: true },
      projection: { _id: 1, name: 1 },
    });
  }
  async getSingleCategory({ slug }: { slug: string }) {
    const category = await this.categoryRepo.findOne({
      filter: { slug, status: CATEGORY_STATUS.PUBLISHED },
      options: { lean: true },
      projection: { _id: 1, name: 1 },
    });

    if (!category) throw new NotFoundException('Category not found');

    const brands = await this.brandRepo.find({
      filter: { categoryIds: category._id },
    });

    return { ...category, brands };
  }

  async listCategoryBrands(id: Types.ObjectId) {
    const category = await this.categoryRepo.findOne({
      filter: { _id: id, status: CATEGORY_STATUS.PUBLISHED },
      options: { lean: true },
    });
    if (!category) throw new NotFoundException('Category not found');

    return this.brandRepo.find({ filter: { categoryIds: id } });
  }
}
