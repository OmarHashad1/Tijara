import { ProductEntity } from '../entities/product.entity';
import { GuestService } from './guest.service';
import { Args, Float, Int, Query } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
import { PaginatedProducts } from '../entities/product.entity';
import {
  ListProductQueryInput,
  ListProductsQueryDto,
} from '../dto/listProductsQuery.dto';
import { AuthenticationGuard } from 'src/common/guards/auth';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Auth } from 'src/common/decorators';
import { ROLE } from 'src/common/enums';
import { RedisCacheInterceptor } from 'src/common/interceptors';

@Resolver()
export class GuestResolver {
  constructor(private readonly guestService: GuestService) {}

  @UseInterceptors(RedisCacheInterceptor)
  @Auth([ROLE.USER])
  @Query((returns) => PaginatedProducts)
  async listProducts(
    @Args('query', { type: () => ListProductQueryInput, nullable: true })
    query: ListProductQueryInput,
  ) {
    return await this.guestService.listProducts(query);
  }

  @Query((returns) => ProductEntity)
  getProduct(@Args('slug', { type: () => String }) slug: string) {
    return this.guestService.getSingleProduct({ slug });
  }
}
