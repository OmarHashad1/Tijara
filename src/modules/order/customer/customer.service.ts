import { BadRequestException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Types } from 'mongoose';
import { CartRepo } from 'src/common/repositories/cart.repo';
import { OrderRepo } from 'src/common/repositories/order.repo';
import { ProductRepo } from 'src/common/repositories/product.repo';
import { ORDER_STATUS } from 'src/common/enums';
import { IOrderItem } from 'src/common/types';
import { CheckoutDto } from '../dto/checkout.dto';
import { ListOrdersQueryDto } from '../dto/list-orders-query.dto';

@Injectable()
export class CustomerService {
  constructor(
    private readonly orderRepo: OrderRepo,
    private readonly cartRepo: CartRepo,
    private readonly productRepo: ProductRepo,
  ) {}

  async checkout(userId: Types.ObjectId, dto: CheckoutDto) {
    const cart = await this.cartRepo.findOne({
      filter: { userId },
      options: { lean: true },
    });
    if (!cart || !cart.items.length)
      throw new BadRequestException('Cart is empty');

    const reserved: { productId: Types.ObjectId; quantity: number }[] = [];
    const orderItems: IOrderItem[] = [];
    let total = 0;

    try {
      for (const item of cart.items) {
        const product = await this.productRepo.findOne({
          filter: { _id: item.productId },
          options: { lean: true },
        });
        if (!product) throw new NotFoundException('Product not found');

        const result = await this.productRepo.updateOne({
          filter: { _id: item.productId, stock: { $gte: item.quantity } },
          update: { $inc: { stock: -item.quantity } },
        });
        if (!result.matchedCount)
          throw new UnprocessableEntityException(
            `Insufficient stock for product "${product.name}"`,
          );
        reserved.push({ productId: item.productId, quantity: item.quantity });

        const unitPrice =product.discountPercent?
        (  Math.round(product.price * (1 - product.discountPercent / 100) * 100) /
          100):product.price
        orderItems.push({
          productId: item.productId,
          name: product.name,
          price: unitPrice,
          quantity: item.quantity,
        });
        total += unitPrice * item.quantity;
      }
    } catch (err) {
      await Promise.all(
        reserved.map((item) =>
          this.productRepo.updateOne({
            filter: { _id: item.productId },
            update: { $inc: { stock: item.quantity } },
          }),
        ),
      );
      throw err;
    }

    const order = await this.orderRepo.create({
      data: {
        userId,
        items: orderItems,
        couponCode: dto.couponCode ?? null,
        total: Math.round(total * 100) / 100,
        status: ORDER_STATUS.PENDING,
      },
    });

    await this.cartRepo.updateOne({
      filter: { userId },
      update: { $set: { items: [] } },
    });

    return order;
  }

  async listOrders(userId: Types.ObjectId, query: ListOrdersQueryDto) {
    const { status, page = 1, size = 20 } = query;
    const filter: Record<string, unknown> = { userId };
    if (status) filter.status = status;

    return this.orderRepo.paginate({ filter, options: {}, page, size });
  }

  async getOrder(userId: Types.ObjectId, id: Types.ObjectId) {
    const order = await this.orderRepo.findOne({
      filter: { _id: id, userId },
      options: { lean: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async cancelOrder(userId: Types.ObjectId, id: Types.ObjectId) {
    const order = await this.orderRepo.findOne({
      filter: { _id: id, userId },
      options: { lean: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== ORDER_STATUS.PENDING)
      throw new BadRequestException('Only pending orders can be cancelled');

    const result = await this.orderRepo.updateOne({
      filter: { _id: id, userId, status: ORDER_STATUS.PENDING },
      update: { $set: { status: ORDER_STATUS.CANCELLED } },
    });
   

    await Promise.all(
      order.items.map((item) =>
        this.productRepo.updateOne({
          filter: { _id: item.productId },
          update: { $inc: { stock: item.quantity } },
        }),
      ),
    );

    return this.orderRepo.findOne({
      filter: { _id: id },
      options: { lean: true },
    });
  }
}
