import { PartialType } from '@nestjs/mapped-types';
import { CreateBrandDto } from './createBrand.dto';

export class UpdateBrandDto extends PartialType(CreateBrandDto) {}
