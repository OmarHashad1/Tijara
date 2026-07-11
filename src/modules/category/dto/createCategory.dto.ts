import {
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
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

@InputType()
export class CreateCategoryInput {
  @Field((type) => String)
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  @MinLength(2)
  name!: string;

  @Field((type) => CATEGORY_STATUS, { nullable: true })
  @IsOptional()
  @IsEnum(CATEGORY_STATUS)
  status?: CATEGORY_STATUS = CATEGORY_STATUS.PUBLISHED;
}
