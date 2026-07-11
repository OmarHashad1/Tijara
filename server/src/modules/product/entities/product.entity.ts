import { Field, Float, Int, ObjectType } from '@nestjs/graphql';


@ObjectType()
export class ProductEntity {
  @Field((type) => String)
  id!: string;

  @Field((type) => String)
  name!: string;

  @Field((type) => String)
  slug!: string;

  @Field((type) => String)
  description!: string;

  @Field((type) => Float)
  price!: number;

  @Field((type) => Int)
  discountPercent!: number;

  @Field((type) => String)
  categoryId!: string;

  @Field((type) => String)
  brandId!: string;

  @Field((type) => [String])
  images!: string[];
}

@ObjectType()
export class ProductListMeta {
  @Field((type) => Int, { nullable: true })
  count?: number;

  @Field((type) => Int, { nullable: true })
  page?: number;

  @Field((type) => Int, { nullable: true })
  size?: number;

  @Field((type) => Int, { nullable: true })
  pages?: number;
}

@ObjectType()
export class PaginatedProducts {
  @Field((type) => [ProductEntity])
  docs!: ProductEntity[];

  @Field((type) => ProductListMeta)
  meta!: ProductListMeta;
}
