import {
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Field, Float, InputType, Int } from '@nestjs/graphql';

export class ListProductsQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsMongoId()
  categoryId?: string;

  @IsOptional()
  @IsMongoId()
  brandId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  size?: number;
}

@InputType()
export class ListProductQueryInput {
  @Field((type) => String, { nullable: true })
  @IsOptional()
  @IsString()
  search?: string;

  @Field((type) => String, { nullable: true })
  @IsOptional()
  @IsMongoId()
  categoryId?: string;

  @Field((type) => String, { nullable: true })
  @IsOptional()
  @IsMongoId()
  brandId?: string;

  @Field((type) => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @Field((type) => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @Field((type) => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @Field((type) => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1)
  size?: number;
}
