import { Module } from '@nestjs/common';
import { ProductRepo } from 'src/common/repositories/product.repo';
import { ProductModel } from 'src/models';

@Module({
  imports: [ProductModel],
  providers: [ProductRepo],
  exports: [ProductRepo],
})
export class ProductModule {}
