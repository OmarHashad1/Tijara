import { User, UserModel } from 'src/models';
import { IUser } from 'src/common/types';
import { DatabaseRepo } from './db.repo';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

export class UserRepo extends DatabaseRepo<IUser> {
  constructor(@InjectModel(User.name) protected readonly model: Model<IUser>) {
    super(model);
  }
}
