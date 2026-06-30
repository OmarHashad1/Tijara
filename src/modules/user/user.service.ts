import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { UserDocument } from 'src/models';
import { UserRepo } from 'src/common/repositories';
import { RedisService } from 'src/common/services/redis';
import { IDecodedToken, IUser, LOGOUT_TYPE } from 'src/common/types';

@Injectable()
export class UserService {
  constructor(
    private readonly redisService: RedisService,
    private readonly userRepo: UserRepo,
  ) {}
  async logout({
    type,
    user,
    decoded,
  }: {
    type: LOGOUT_TYPE;
    user: UserDocument;
    decoded: IDecodedToken;
  }) {
    const { jti, iat } = decoded;
    switch (type) {
      case LOGOUT_TYPE.DEVICE: {
        await this.redisService.set({
          key: this.redisService.revokedTokenKey({
            jti,
            userId: user._id,
          }),
          value: jti,
          ttl: iat + 7 * 24 * 60 * 60 - Math.floor(Date.now() / 1000),
        });
        break;
      }
      case LOGOUT_TYPE.ALL: {
        await this.userRepo.updateOne({
          filter: {
            _id: user._id,
          },
          update: {
            credentialsChangedAt: new Date(),
          },
        });
        await this.redisService.removeFCMUser(user._id);
        break;
      }
      default: {
        throw new Error('Invalid Logout Type');
      }
    }
  }
}
