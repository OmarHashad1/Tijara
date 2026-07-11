import { PartialType } from '@nestjs/mapped-types';
import { PartialType as GraphQLPartialType, InputType } from '@nestjs/graphql';
import { CreateCategoryDto, CreateCategoryInput } from './createCategory.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

@InputType()
export class UpdateCategoryInput extends GraphQLPartialType(
  CreateCategoryInput,
) {}
