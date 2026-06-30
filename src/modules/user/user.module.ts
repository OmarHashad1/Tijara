import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserModel } from 'src/models';
import { UserRepo } from 'src/common/repositories';

@Module({
  imports: [UserModel],
  exports: [UserRepo],
  controllers: [UserController],
  providers: [UserService, UserRepo],
})
export class UserModule {}
