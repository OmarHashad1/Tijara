import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CustomerService } from './customer.service';
import { ROLE } from 'src/common/enums';
import { Auth } from 'src/common/decorators';
import { User } from 'src/common/decorators';
import { type IUser } from 'src/common/types';
import { type Request } from 'express';
import { type UserDocument } from 'src/models';
import { LogoutDto } from '../dto/logout.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { AddAddressDto } from '../dto/add-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { AddPaymentMethodDto } from '../dto/add-payment-method.dto';

@Controller('user')
@Auth([ROLE.USER])
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('/me')
  profile(@User() user: IUser) {
    return { message: 'User profile fetched successfully', data: user };
  }

  @Patch('/me')
  async updateProfile(
    @User() user: UserDocument,
    @Body() dto: UpdateProfileDto,
  ) {
    await this.customerService.updateProfile(user._id, dto);
    return { message: 'Profile updated successfully' };
  }

  @Patch('/me/password')
  async changePassword(
    @User() user: UserDocument,
    @Body() dto: ChangePasswordDto,
  ) {
    await this.customerService.changePassword(user._id, dto);
    return { message: 'Password changed successfully' };
  }

  @Get('/me/addresses')
  async getAddresses(@User() user: UserDocument) {
    const addresses = await this.customerService.getAddresses(user._id);
    return { message: 'Addresses fetched successfully', data: addresses };
  }

  @Post('/me/addresses')
  async addAddress(@User() user: UserDocument, @Body() dto: AddAddressDto) {
    await this.customerService.addAddress(user._id, dto);
    return { message: 'Address added successfully' };
  }

  @Patch('/me/addresses/:id')
  async updateAddress(
    @User() user: UserDocument,
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
  ) {
    await this.customerService.updateAddress(
      user._id,
      new Types.ObjectId(id),
      dto,
    );
    return { message: 'Address updated successfully' };
  }

  @Delete('/me/addresses/:id')
  async deleteAddress(@User() user: UserDocument, @Param('id') id: string) {
    await this.customerService.deleteAddress(user._id, new Types.ObjectId(id));
    return { message: 'Address deleted successfully' };
  }

  @Get('/me/payment-methods')
  async getPaymentMethods(@User() user: UserDocument) {
    const methods = await this.customerService.getPaymentMethods(user._id);
    return { message: 'Payment methods fetched successfully', data: methods };
  }

  @Post('/me/payment-methods')
  async addPaymentMethod(
    @User() user: UserDocument,
    @Body() dto: AddPaymentMethodDto,
  ) {
    await this.customerService.addPaymentMethod(user._id, dto);
    return { message: 'Payment method added successfully' };
  }

  @Delete('/me/payment-methods/:id')
  async deletePaymentMethod(
    @User() user: UserDocument,
    @Param('id') id: string,
  ) {
    await this.customerService.deletePaymentMethod(
      user._id,
      new Types.ObjectId(id),
    );
    return { message: 'Payment method removed successfully' };
  }

  @Delete('/me')
  async deleteAccount(@User() user: UserDocument) {
    await this.customerService.deleteAccount(user._id);
    return { message: 'Account deleted successfully' };
  }

  @Post('/logout')
  async logout(@Req() req: Request, @Body() dto: LogoutDto) {
    const { user, decoded } = req.credentials;
    await this.customerService.logout({ type: dto.type, user, decoded });
    return { message: 'Logged out successfully' };
  }
}
