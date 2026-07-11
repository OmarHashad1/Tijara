import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';
import { Types } from 'mongoose';
import { Auth } from 'src/common/decorators';
import { ROLE } from 'src/common/enums';
import { ParseObjectIdPipe } from 'src/common/pipes';
import { ListAdminReviewsQueryDto } from '../dto/list-admin-reviews-query.dto';
import { AdminService } from './admin.service';

@Controller('admin/reviews')
@Auth([ROLE.ADMIN])
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  async listReviews(@Query() query: ListAdminReviewsQueryDto) {
    const payload = await this.adminService.listReviews(query);
    return { message: 'Reviews fetched successfully', payload };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteReview(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    await this.adminService.deleteReview(id);
    return { message: 'Review deleted successfully' };
  }
}
