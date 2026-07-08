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
import { S3Service } from 'src/common/services/aws';
import { STORAGE_TYPE } from 'src/common/enums/multer.enum';
import { CreateBrandDto } from '../dto/createBrand.dto';
import { UpdateBrandDto } from '../dto/updateBrand.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly brandRepo: BrandRepo,
    private readonly categoryRepo: CategoryRepo,
    private readonly s3Service: S3Service,
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

  private async uploadLogo(file: Express.Multer.File,_id:Types.ObjectId) {
    const key = await this.s3Service.uploadAsset({
      storageStrategy: STORAGE_TYPE.DISK,
      file,
      path: `brands/${_id}`,
    });
return key  }



  async createBrand(dto: CreateBrandDto, logo?: Express.Multer.File) {
    const brandExists = await this.brandRepo.findOne({
      filter: { name: dto.name },
    });
    if (brandExists)
      throw new ConflictException('A brand with this name already exists');

    await this.assertCategoriesExist(dto.categoryIds);

    const _id = new Types.ObjectId()
    const Key = logo ? await this.uploadLogo(logo,_id) : null;
    const slug = createSlug(dto.name);
    const payload = await this.brandRepo.create({
      data: {
        _id,
        name: dto.name,
        slug,
        categoryIds: dto.categoryIds.map((id) => new Types.ObjectId(id)),
        logo:Key,
        description: dto.description ?? null,
      },
    });

    if(!payload && logo){
     await this.s3Service.deleteAsset({Key} as {Key:string})
      throw new BadRequestException()
    }
    return payload;
  }

  async updateBrand(
    id: Types.ObjectId,
    dto: UpdateBrandDto,
    logo?: Express.Multer.File,
  ) {
    const brand = await this.brandRepo.findOne({
      filter: { _id: id },
      options: { lean: true },
    });
    if (!brand) throw new NotFoundException('Brand not found');

    const update: Partial<{
      name: string;
      slug: string;
      categoryIds: Types.ObjectId[];
      logo: string | null;
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
    if (dto.description !== undefined) update.description = dto.description;

    if (logo) {
  
      update.logo = await this.uploadLogo(logo,id);
      if (brand.logo) await this.s3Service.deleteAsset({Key:brand.logo});
    }

    const payload = await this.brandRepo.findOneAndUpdate({
      filter: { _id: id },
      update: { $set: update },
      options: { new: true },
    });
    return payload;
  }

  async deleteBrand(id: Types.ObjectId) {
    const brand = await this.brandRepo.findOne({
      filter: { _id: id },
      options: { lean: true },
    });
    if (!brand) throw new NotFoundException('Brand not found');

    await this.brandRepo.deleteOne({ filter: { _id: id } });
    if (brand.logo) await this.s3Service.deleteAsset({Key:brand.logo});
  }
}
