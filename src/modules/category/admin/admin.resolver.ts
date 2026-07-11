import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { Auth } from 'src/common/decorators';
import { ROLE } from 'src/common/enums';
import { AdminService } from './admin.service';
import { CategoryEntity } from '../entities/category.entity';
import { CreateCategoryInput } from '../dto/createCategory.dto';
import { UpdateCategoryInput } from '../dto/updateCategory.dto';

@Resolver()
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  @Auth([ROLE.ADMIN])
  @Mutation((returns) => CategoryEntity)
  async createCategory(@Args('input') input: CreateCategoryInput) {
    return this.adminService.createCategory(input);
  }

  @Auth([ROLE.ADMIN])
  @Mutation((returns) => CategoryEntity)
  async updateCategory(
    @Args('id', { type: () => String }) id: string,
    @Args('input') input: UpdateCategoryInput,
  ) {
    return this.adminService.updateCategory(new Types.ObjectId(id), input);
  }

  @Auth([ROLE.ADMIN])
  @Mutation((returns) => Boolean)
  async deleteCategory(@Args('id', { type: () => String }) id: string) {
    await this.adminService.deleteCategory(new Types.ObjectId(id));
    return true;
  }
}
