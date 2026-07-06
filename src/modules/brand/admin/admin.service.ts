import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { BrandRepo } from 'src/common/repositories/brand.repo';
import { CategoryRepo } from 'src/common/repositories/category.repo';
import { createSlug } from 'src/common/utils/slugify.util';
import { CreateBrandDto } from '../dto/createBrand.dto';
import { UpdateBrandDto } from '../dto/updateBrand.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly brandRepo: BrandRepo,
    private readonly categoryRepo: CategoryRepo,
  ) {}

  private async assertCategoriesExist(categoryIds: string[]) {
    const uniqueIds = [...new Set(categoryIds)];
    const categories = await this.categoryRepo.find({
      filter: { _id: { $in: uniqueIds } },
      options: { lean: true },
    });
    if ((categories ?? []).length !== uniqueIds.length)
      throw new BadRequestException('One or more categories do not exist');
  }

  async createBrand(dto: CreateBrandDto) {
    const brandExists = await this.brandRepo.findOne({
      filter: { name: dto.name },
    });
    if (brandExists)
      throw new ConflictException('A brand with this name already exists');

    await this.assertCategoriesExist(dto.categoryIds);

    const slug = createSlug(dto.name);
    const payload = await this.brandRepo.create({
      data: {
        name: dto.name,
        slug,
        categoryIds: dto.categoryIds.map((id) => new Types.ObjectId(id)),
        logoUrl: dto.logoUrl ?? null,
        description: dto.description ?? null,
      },
    });
    return payload;
  }

  async updateBrand(id: Types.ObjectId, dto: UpdateBrandDto) {
    const brand = await this.brandRepo.findOne({
      filter: { _id: id },
      options: { lean: true },
    });
    if (!brand) throw new NotFoundException('Brand not found');

    const update: Partial<{
      name: string;
      slug: string;
      categoryIds: Types.ObjectId[];
      logoUrl: string | null;
      description: string | null;
    }> = {};

    if (dto.name && dto.name !== brand.name) {
      const brandExists = await this.brandRepo.findOne({
        filter: { _id: { $ne: id }, name: dto.name },
      });
      if (brandExists)
        throw new ConflictException('A brand with this name already exists');
      update.name = dto.name;
      update.slug = createSlug(dto.name);
    }
    if (dto.categoryIds) {
      await this.assertCategoriesExist(dto.categoryIds);
      update.categoryIds = dto.categoryIds.map((id) => new Types.ObjectId(id));
    }
    if (dto.logoUrl !== undefined) update.logoUrl = dto.logoUrl;
    if (dto.description !== undefined) update.description = dto.description;

    const payload = await this.brandRepo.findOneAndUpdate({
      filter: { _id: id },
      update: { $set: update },
      options: { new: true },
    });
    return payload;
  }

  async deleteBrand(id: Types.ObjectId) {
    const result = await this.brandRepo.deleteOne({ filter: { _id: id } });
    if (!result.deletedCount) throw new NotFoundException('Brand not found');
  }
}
