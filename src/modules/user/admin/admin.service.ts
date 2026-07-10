import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { UserRepo } from 'src/common/repositories';
import { USER_STATUS, USER_STATUS_TRANSITIONS } from 'src/common/enums';
import { EMAIL_EVENTS } from 'src/common/enums/email.enums';
import { emailEmitter } from 'src/common/events/email.event';
import { BanUserDto } from '../dto/ban-user.dto';
import { ListUsersQueryDto } from '../dto/list-users-query.dto';

@Injectable()
export class AdminService {
  constructor(private readonly userRepo: UserRepo) {}

  async listUsers(query: ListUsersQueryDto) {
    const { search, status, role, page = 1, size = 20 } = query;
    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) filter.status = status;
    if (role) filter.role = role;

    return this.userRepo.paginate({ filter, options: {}, page, size });
  }

  async getUser(id: Types.ObjectId) {
    const user = await this.userRepo.findOne({
      filter: { _id: id },
      options: { lean: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async banUser(id: Types.ObjectId, dto: BanUserDto) {
    const user = await this.userRepo.findOne({
      filter: { _id: id },
      options: { lean: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (
      !(USER_STATUS_TRANSITIONS.ban as readonly string[]).includes(user.status)
    ) {
      throw new BadRequestException('User is already banned');
    }
    await this.userRepo.updateOne({
      filter: { _id: id },
      update: {
        $set: { status: USER_STATUS.BANNED, banReason: dto.banReason },
      },
    });

    emailEmitter.emit(EMAIL_EVENTS.USER_BANNED, {
      to: user.email,
      firstName: user.firstName,
      reason: dto.banReason,
    });
  }

  async unbanUser(id: Types.ObjectId) {
    const user = await this.userRepo.findOne({
      filter: { _id: id },
      options: { lean: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (
      !(USER_STATUS_TRANSITIONS.unban as readonly string[]).includes(
        user.status,
      )
    ) {
      throw new BadRequestException('User is not banned');
    }
    await this.userRepo.updateOne({
      filter: { _id: id },
      update: { $set: { status: USER_STATUS.ACTIVE, banReason: null } },
    });

    emailEmitter.emit(EMAIL_EVENTS.USER_UNBANNED, {
      to: user.email,
      firstName: user.firstName,
    });
  }

  async softDeleteUser(id: Types.ObjectId) {
    const now = new Date();
    const result = await this.userRepo.updateOne({
      filter: { _id: id, deletedAt: null },
      update: { $set: { deletedAt: now, credentialsChangedAt: now } },
    });
    if (!result.matchedCount)
      throw new NotFoundException('User not found or already deleted');
  }

  async hardDeleteUser(id: Types.ObjectId) {
    const result = await this.userRepo.deleteOne({ filter: { _id: id } });
    if (!result.deletedCount) throw new NotFoundException('User not found');
  }

  async restoreUser(id: Types.ObjectId) {
    const result = await this.userRepo.updateOne({
      filter: { _id: id, deletedAt: { $ne: null } },
      update: { $set: { deletedAt: null, restoredAt: new Date() } },
    });
    if (!result.matchedCount)
      throw new NotFoundException('User not found or not deleted');
  }
}
