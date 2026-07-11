import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CATEGORY_STATUS } from 'src/common/enums';
import { BrandEntity } from 'src/modules/brand/entities/brand.entity';

registerEnumType(CATEGORY_STATUS, { name: 'CATEGORY_STATUS' });

@ObjectType()
export class CategoryEntity {
  @Field((type) => String)
  id!: string;

  @Field((type) => String)
  name!: string;

  @Field((type) => String, { nullable: true })
  slug?: string;

  @Field((type) => CATEGORY_STATUS, { nullable: true })
  status?: CATEGORY_STATUS;
}

@ObjectType()
export class CategoryWithBrands extends CategoryEntity {
  @Field((type) => [BrandEntity])
  brands!: BrandEntity[];
}
