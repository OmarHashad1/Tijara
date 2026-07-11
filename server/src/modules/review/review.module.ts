import { Module } from '@nestjs/common';
import { ReviewRepo } from 'src/common/repositories/review.repo';
import { ReviewModel } from 'src/models';

@Module({
  imports: [ReviewModel],
  providers: [ReviewRepo],
  exports: [ReviewRepo],
})
export class ReviewModule {}
