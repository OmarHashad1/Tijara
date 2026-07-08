import {
  ArrayNotEmpty,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(64)
  name!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  categoryIds!: string[];

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  description?: string;
}
