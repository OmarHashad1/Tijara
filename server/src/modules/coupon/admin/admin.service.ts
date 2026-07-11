import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CouponRepo } from 'src/common/repositories/coupon.repo';
import { DISCOUNT_TYPE } from 'src/common/enums';
import { CreateCouponDto } from '../dto/create-coupon.dto';
import { UpdateCouponDto } from '../dto/update-coupon.dto';
import { ListCouponsQueryDto } from '../dto/list-coupons-query.dto';

@Injectable()
export class AdminService {
  constructor(private readonly couponRepo: CouponRepo) {}

  async listCoupons(query: ListCouponsQueryDto) {
    const { search, page = 1, size = 20 } = query;
    const filter: Record<string, unknown> = {};
    if (search) filter.code = { $regex: search, $options: 'i' };

    return this.couponRepo.paginate({ filter, options: {}, page, size });
  }

  async createCoupon(dto: CreateCouponDto) {
    const code = dto.code.trim().toUpperCase();
    const couponExists = await this.couponRepo.findOne({
      filter: { code },
      options: { lean: true },
    });
    if (couponExists)
      throw new ConflictException('A coupon with this code already exists');

    if (dto.discountType === DISCOUNT_TYPE.PERCENT && dto.discountValue > 100)
      throw new BadRequestException(
        'Percent discount value cannot exceed 100',
      );

    const expiresAt = new Date(dto.expiresAt);
    if (expiresAt <= new Date())
      throw new BadRequestException('Expiry date must be in the future');

    const payload = await this.couponRepo.create({
      data: {
        code,
        discountType: dto.discountType,
        discountValue: dto.discountValue,
        expiresAt,
        usageLimit: dto.usageLimit,
        timesUsed: 0,
      },
    });
    return payload;
  }

  async updateCoupon(id: Types.ObjectId, dto: UpdateCouponDto) {
    const coupon = await this.couponRepo.findOne({
      filter: { _id: id },
      options: { lean: true },
    });
    if (!coupon) throw new NotFoundException('Coupon not found');

    const update: Partial<{
      code: string;
      discountType: DISCOUNT_TYPE;
      discountValue: number;
      expiresAt: Date;
      usageLimit: number;
    }> = {};

    if (dto.code) {
      const code = dto.code.trim().toUpperCase();
      if (code !== coupon.code) {
        const couponExists = await this.couponRepo.findOne({
          filter: { _id: { $ne: id }, code },
          options: { lean: true },
        });
        if (couponExists)
          throw new ConflictException(
            'A coupon with this code already exists',
          );
        update.code = code;
      }
    }

    const effectiveType = dto.discountType ?? coupon.discountType;
    const effectiveValue = dto.discountValue ?? coupon.discountValue;
    if (effectiveType === DISCOUNT_TYPE.PERCENT && effectiveValue > 100)
      throw new BadRequestException(
        'Percent discount value cannot exceed 100',
      );
    if (dto.discountType !== undefined) update.discountType = dto.discountType;
    if (dto.discountValue !== undefined)
      update.discountValue = dto.discountValue;

    if (dto.expiresAt !== undefined) {
      const expiresAt = new Date(dto.expiresAt);
      if (expiresAt <= new Date())
        throw new BadRequestException('Expiry date must be in the future');
      update.expiresAt = expiresAt;
    }

    if (dto.usageLimit !== undefined) {
      if (dto.usageLimit < coupon.timesUsed)
        throw new BadRequestException(
          'Usage limit cannot be less than the number of times already used',
        );
      update.usageLimit = dto.usageLimit;
    }

    const payload = await this.couponRepo.findOneAndUpdate({
      filter: { _id: id },
      update: { $set: update },
      options: { new: true },
    });
    return payload;
  }

  async deleteCoupon(id: Types.ObjectId) {
    const result = await this.couponRepo.deleteOne({ filter: { _id: id } });
    if (!result.deletedCount) throw new NotFoundException('Coupon not found');
  }
}
