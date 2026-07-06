import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { BrandRepo } from 'src/common/repositories/brand.repo';
import { CategoryRepo } from 'src/common/repositories/category.repo';
import { ProductRepo } from 'src/common/repositories/product.repo';
import { createSlug } from 'src/common/utils/slugify.util';
import { CreateProductDto } from '../dto/createProduct.dto';
import { UpdateProductDto } from '../dto/updateProduct.dto';
import { AdjustStockDto } from '../dto/adjustStock.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly productRepo: ProductRepo,
    private readonly categoryRepo: CategoryRepo,
    private readonly brandRepo: BrandRepo,
  ) {}

  private async assertCategoryAndBrand(categoryId: string, brandId: string) {
    const [category, brand] = await Promise.all([
      this.categoryRepo.findOne({
        filter: { _id: categoryId },
        options: { lean: true },
      }),
      this.brandRepo.findOne({
        filter: { _id: brandId },
        options: { lean: true },
      }),
    ]);
    if (!category) throw new BadRequestException('Category does not exist');
    if (!brand) throw new BadRequestException('Brand does not exist');
    if (!brand.categoryIds.some((id) => id.toString() === categoryId))
      throw new BadRequestException(
        'Brand does not belong to the given category',
      );
  }

  async createProduct(dto: CreateProductDto) {
    const productExists = await this.productRepo.findOne({
      filter: { name: dto.name },
    });
    if (productExists)
      throw new ConflictException('A product with this name already exists');

    await this.assertCategoryAndBrand(dto.categoryId, dto.brandId);

    const slug = createSlug(dto.name);
    const payload = await this.productRepo.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description ?? null,
        price: dto.price,
        discountPercent: dto.discountPercent ?? 0,
        stock: dto.stock ?? 0,
        categoryId: new Types.ObjectId(dto.categoryId),
        brandId: new Types.ObjectId(dto.brandId),
        images: dto.images ?? [],
      },
    });
    return payload;
  }

  async updateProduct(id: Types.ObjectId, dto: UpdateProductDto) {
    const product = await this.productRepo.findOne({
      filter: { _id: id },
      options: { lean: true },
    });
    if (!product) throw new NotFoundException('Product not found');

    const update: Partial<{
      name: string;
      slug: string;
      description: string | null;
      price: number;
      discountPercent: number;
      categoryId: Types.ObjectId;
      brandId: Types.ObjectId;
      images: string[];
    }> = {};

    if (dto.name && dto.name !== product.name) {
      const productExists = await this.productRepo.findOne({
        filter: { _id: { $ne: id }, name: dto.name },
      });
      if (productExists)
        throw new ConflictException(
          'A product with this name already exists',
        );
      update.name = dto.name;
      update.slug = createSlug(dto.name);
    }

    if (dto.categoryId || dto.brandId) {
      const categoryId = dto.categoryId ?? product.categoryId.toString();
      const brandId = dto.brandId ?? product.brandId.toString();
      await this.assertCategoryAndBrand(categoryId, brandId);
      if (dto.categoryId) update.categoryId = new Types.ObjectId(categoryId);
      if (dto.brandId) update.brandId = new Types.ObjectId(brandId);
    }

    if (dto.description !== undefined) update.description = dto.description;
    if (dto.price !== undefined) update.price = dto.price;
    if (dto.discountPercent !== undefined)
      update.discountPercent = dto.discountPercent;
    if (dto.images !== undefined) update.images = dto.images;

    const payload = await this.productRepo.findOneAndUpdate({
      filter: { _id: id },
      update: { $set: update },
      options: { new: true },
    });
    return payload;
  }

  async adjustStock(id: Types.ObjectId, dto: AdjustStockDto) {
    const product = await this.productRepo.findOne({
      filter: { _id: id },
      options: { lean: true },
    });
    if (!product) throw new NotFoundException('Product not found');

    const stock = product.stock + dto.quantity;
    if (stock < 0) throw new BadRequestException('Insufficient stock');

    const payload = await this.productRepo.findOneAndUpdate({
      filter: { _id: id },
      update: { $set: { stock } },
      options: { new: true },
    });
    return payload;
  }

  async deleteProduct(id: Types.ObjectId) {
    const result = await this.productRepo.deleteOne({ filter: { _id: id } });
    if (!result.deletedCount) throw new NotFoundException('Product not found');
  }
}
