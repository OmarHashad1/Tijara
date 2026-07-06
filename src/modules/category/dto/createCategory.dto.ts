import {
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CATEGORY_STATUS } from 'src/common/enums';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsEnum(CATEGORY_STATUS)
  status?: CATEGORY_STATUS = CATEGORY_STATUS.PUBLISHED;
}
