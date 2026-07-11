import { Module } from '@nestjs/common';
import { BrandRepo } from 'src/common/repositories/brand.repo';
import { BrandModel } from 'src/models';

@Module({ imports: [BrandModel], exports: [BrandRepo], providers: [BrandRepo] })
export class BrandModule {}
