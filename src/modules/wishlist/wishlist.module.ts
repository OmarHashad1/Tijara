import { Module } from '@nestjs/common';
import { WishlistRepo } from 'src/common/repositories/wishlist.repo';
import { WishlistModel } from 'src/models';

@Module({
  imports: [WishlistModel],
  providers: [WishlistRepo],
  exports: [WishlistRepo],
})
export class WishlistModule {}
