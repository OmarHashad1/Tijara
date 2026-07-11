import { CATEGORY_STATUS } from 'src/common/enums';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CategoryRepo } from 'src/common/repositories/category.repo';
import { BrandRepo } from 'src/common/repositories/brand.repo';
import { CreateCategoryDto } from '../dto/createCategory.dto';
import { UpdateCategoryDto } from '../dto/updateCategory.dto';
import { createSlug } from 'src/common/utils/slugify.util';

@Injectable()
export class AdminService {
  constructor(
    private readonly categoryRepo: CategoryRepo,
    private readonly brandRepo: BrandRepo,
  ) {}

  async createCategory(dto: CreateCategoryDto) {
    const { name, status = CATEGORY_STATUS.DRAFT } = dto;
    const categoryExists = await this.categoryRepo.findOne({
      filter: { name: name },
    });
    if (categoryExists)
      throw new ConflictException('A category with this name already exists');
    const slug = createSlug(name);
    const payload = await this.categoryRepo.create({
      data: { name, status, slug },
    });
    return { id: payload.id, name, slug: payload.slug, status: payload.status };
  }

  async updateCategory(id: Types.ObjectId, dto: UpdateCategoryDto) {
    const category = await this.categoryRepo.findOne({
      filter: { _id: id },
      options: { lean: true },
    });
    if (!category) throw new NotFoundException('Category not found');

    const update: Partial<{
      name: string;
      slug: string;
      status: CATEGORY_STATUS;
    }> = {};

    if (dto.name && dto.name !== category.name) {
      const categoryExists = await this.categoryRepo.findOne({
        filter: { _id: { $ne: id }, name: dto.name },
      });
      if (categoryExists)
        throw new ConflictException(
          'A category with this name already exists',
        );
      update.name = dto.name;
      update.slug = createSlug(dto.name);
    }
    if (dto.status) update.status = dto.status;

    const payload = await this.categoryRepo.findOneAndUpdate({
      filter: { _id: id },
      update: { $set: update },
      options: { new: true },
    });
    return payload;
  }

  async deleteCategory(id: Types.ObjectId) {
    const result = await this.categoryRepo.deleteOne({ filter: { _id: id } });
    if (!result.deletedCount) throw new NotFoundException('Category not found');

    await this.brandRepo.updateMany({
      filter: { categoryIds: id },
      update: { $pull: { categoryIds: id } },
    });
  }
}
