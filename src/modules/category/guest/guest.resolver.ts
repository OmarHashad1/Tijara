import { Args, Query, Resolver } from '@nestjs/graphql';
import { GuestService } from './guest.service';
import { CategoryEntity, CategoryWithBrands } from '../entities/category.entity';

@Resolver()
export class GuestResolver {
  constructor(private readonly guestService: GuestService) {}

  @Query((returns) => [CategoryEntity])
  async categories() {
    return this.guestService.listCategories();
  }

  @Query((returns) => CategoryWithBrands)
  async category(@Args('slug', { type: () => String }) slug: string) {
    return this.guestService.getSingleCategory({ slug });
  }
}
