import { BadRequestException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { UserDocument } from 'src/models';
import { UserRepo } from 'src/common/repositories';
import { RedisService } from 'src/common/services/redis';
import { SecurityService } from 'src/common/services/security';
import { IDecodedToken, LOGOUT_TYPE } from 'src/common/types';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { AddAddressDto } from '../dto/add-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';

@Injectable()
export class CustomerService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly redisService: RedisService,
    private readonly securityService: SecurityService,
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
          key: this.redisService.revokedTokenKey({ jti, userId: user._id }),
          value: jti,
          ttl: iat + 7 * 24 * 60 * 60 - Math.floor(Date.now() / 1000),
        });
        break;
      }
      case LOGOUT_TYPE.ALL: {
        await this.userRepo.updateOne({
          filter: { _id: user._id },
          update: { credentialsChangedAt: new Date() },
        });
        break;
      }
      default:
        throw new Error('Invalid Logout Type');
    }
  }

  async updateProfile(userId: Types.ObjectId, dto: UpdateProfileDto) {
    await this.userRepo.updateOne({
      filter: { _id: userId },
      update: { $set: dto },
    });
  }

  async changePassword(userId: Types.ObjectId, dto: ChangePasswordDto) {
    const user = await this.userRepo.findOne({
      filter: { _id: userId },
      projection: { password: 1, oldPasswords: 1 },
      options: { lean: true },
    });

    if (
      !user?.password ||
      !(await this.securityService.verify(user.password, dto.oldPassword))
    ) {
      throw new BadRequestException('Current password is incorrect');
    }

    for (const old of user.oldPasswords ?? []) {
      if (await this.securityService.verify(old, dto.newPassword)) {
        throw new BadRequestException('Password was used before');
      }
    }

    await this.userRepo.updateOne({
      filter: { _id: userId },
      update: {
        $set: {
          password: await this.securityService.hash(dto.newPassword),
          credentialsChangedAt: new Date(),
        },
        $push: { oldPasswords: user.password },
      },
    });
  }

  async getAddresses(userId: Types.ObjectId) {
    const user = await this.userRepo.findOne({
      filter: { _id: userId },
      projection: { addresses: 1 },
      options: { lean: true },
    });
    return user?.addresses ?? [];
  }

  async addAddress(userId: Types.ObjectId, dto: AddAddressDto) {
    if (dto.isDefault) {
      await this.userRepo.updateOne({
        filter: { _id: userId },
        update: { $set: { 'addresses.$[].isDefault': false } },
      });
    }
    await this.userRepo.updateOne({
      filter: { _id: userId },
      update: { $push: { addresses: dto } },
    });
  }

  async updateAddress(
    userId: Types.ObjectId,
    addressId: Types.ObjectId,
    dto: UpdateAddressDto,
  ) {
    if (dto.isDefault) {
      await this.userRepo.updateOne({
        filter: { _id: userId },
        update: { $set: { 'addresses.$[].isDefault': false } },
      });
    }
    await this.userRepo.updateOne({
      filter: { _id: userId, 'addresses._id': addressId },
      update: {
        $set: {
          ...(dto.city !== undefined && { 'addresses.$.city': dto.city }),
          ...(dto.country !== undefined && {
            'addresses.$.country': dto.country,
          }),
          ...(dto.isDefault !== undefined && {
            'addresses.$.isDefault': dto.isDefault,
          }),
        },
      },
    });
  }

  async deleteAddress(userId: Types.ObjectId, addressId: Types.ObjectId) {
    await this.userRepo.updateOne({
      filter: { _id: userId },
      update: { $pull: { addresses: { _id: addressId } } },
    });
  }

  async deleteAccount(userId: Types.ObjectId) {
    const now = new Date();
    await this.userRepo.updateOne({
      filter: { _id: userId },
      update: { $set: { deletedAt: now, credentialsChangedAt: now } },
    });
  }

}
