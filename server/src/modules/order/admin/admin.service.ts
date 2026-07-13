import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { OrderRepo } from 'src/common/repositories/order.repo';
import { ProductRepo } from 'src/common/repositories/product.repo';
import { UserRepo } from 'src/common/repositories';
import { ORDER_STATUS, ORDER_STATUS_TRANSITIONS } from 'src/common/enums';
import { EMAIL_EVENTS } from 'src/common/enums/email.enums';
import { emailEmitter } from 'src/common/events/email.event';
import { ListAdminOrdersQueryDto } from '../dto/list-admin-orders-query.dto';
import { UpdateOrderStatusDto } from '../dto/update-order-status.dto';
import { RealtimeGateway } from 'src/realtime/realtime.gateway';

@Injectable()
export class AdminService {
  constructor(
    private readonly orderRepo: OrderRepo,
    private readonly productRepo: ProductRepo,
    private readonly userRepo: UserRepo,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  async listOrders(query: ListAdminOrdersQueryDto) {
    const { status, userId, page = 1, size = 20 } = query;
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (userId) filter.userId = new Types.ObjectId(userId);

    return this.orderRepo.paginate({ filter, options: {}, page, size });
  }

  async getOrder(id: Types.ObjectId) {
    const order = await this.orderRepo.findOne({
      filter: { _id: id },
      options: { lean: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: Types.ObjectId, dto: UpdateOrderStatusDto) {
    const order = await this.orderRepo.findOne({
      filter: { _id: id },
      options: { lean: true },
    });
    if (!order) throw new NotFoundException('Order not found');

    const allowedNextStatuses = ORDER_STATUS_TRANSITIONS[order.status];
    if (!allowedNextStatuses.includes(dto.status))
      throw new BadRequestException(
        `Cannot transition order from "${order.status}" to "${dto.status}"`,
      );

    const result = await this.orderRepo.updateOne({
      filter: { _id: id, status: order.status },
      update: { $set: { status: dto.status } },
    });
    if (!result.matchedCount)
      throw new BadRequestException(
        'Order status changed concurrently, please retry',
      );

    if (dto.status === ORDER_STATUS.CANCELLED) {
      await Promise.all(
        order.items.map((item) =>
          this.productRepo.updateOne({
            filter: { _id: item.productId },
            update: { $inc: { stock: item.quantity } },
          }),
        ),
      );
    }

    const user = await this.userRepo.findOne({
      filter: { _id: order.userId },
      options: { lean: true },
    });
    if (user) {
      emailEmitter.emit(EMAIL_EVENTS.ORDER_STATUS_UPDATED, {
        to: user.email,
        firstName: user.firstName,
        orderId: id.toString(),
        status: dto.status,
      });
    }

    this.realtimeGateway.handleOrderStatusUpdate(order);

    return this.orderRepo.findOne({
      filter: { _id: id },
      options: { lean: true },
    });
  }
}
