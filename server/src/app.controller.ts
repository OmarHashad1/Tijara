import { Controller, Get, SetMetadata, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { RedisCacheInterceptor } from './common/interceptors';
import { TTL } from './common/decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @TTL(10)
  @UseInterceptors(RedisCacheInterceptor)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
