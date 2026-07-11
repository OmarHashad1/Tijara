import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './createProduct.dto';

export class UpdateProductDto extends PartialType(
  OmitType(CreateProductDto, ['stock'] as const),
) {}
