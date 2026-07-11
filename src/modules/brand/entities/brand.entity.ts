import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BrandEntity {
  @Field((type) => String)
  id!: string;

  @Field((type) => String)
  name!: string;

  @Field((type) => String)
  slug!: string;

  @Field((type) => String, { nullable: true })
  logo!: string | null;

  @Field((type) => String, { nullable: true })
  description!: string | null;
}
