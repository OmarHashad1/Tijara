import { Module } from '@nestjs/common';
import { UserModel } from 'src/models';
import { UserRepo } from 'src/common/repositories';

@Module({
  imports: [UserModel],
  providers: [UserRepo],
  exports: [UserRepo],
})
export class UserModule {}
