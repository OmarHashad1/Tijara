import { Module } from '@nestjs/common';
import { CategoryRepo } from 'src/common/repositories/category.repo';
import { CategoryModel } from 'src/models';

@Module({
  imports: [CategoryModel],
  providers: [CategoryRepo],
  exports: [CategoryRepo],
})
export class CategoryModule {}
