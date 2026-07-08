import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { HydratedDocument, Types } from 'mongoose';
import { CartRepo } from 'src/common/repositories/cart.repo';
import { OrderRepo } from 'src/common/repositories/order.repo';
import { ProductRepo } from 'src/common/repositories/product.repo';
import { ORDER_STATUS, PAYMENT_PROVIDER } from 'src/common/enums';
import { IOrderItem, IProduct } from 'src/common/types';
import { CheckoutDto } from '../dto/checkout.dto';
import { ListOrdersQueryDto } from '../dto/list-orders-query.dto';
import { PaymentService } from 'src/common/services/payment/payment.service';
import { PaymentRepo } from 'src/common/repositories/payment.repo';
import { ConfigService } from '@nestjs/config';
import { UserDocument } from 'src/models';

@Injectable()
export class CustomerService {
  constructor(
    private readonly orderRepo: OrderRepo,
    private readonly cartRepo: CartRepo,
    private readonly productRepo: ProductRepo,
    private readonly paymentService: PaymentService,
    private readonly paymentRepo: PaymentRepo,
    private readonly configService: ConfigService,
  ) {}

  async checkout(user: UserDocument, dto: CheckoutDto) {
    const cart = await this.cartRepo.findOne({
      filter: { userId: user._id },
      options: { lean: true,populate:{path:"items.productId"} },
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

        const unitPrice = product.discountPercent
          ? Math.round(
              product.price * (1 - product.discountPercent / 100) * 100,
            ) / 100
          : product.price;
        orderItems.push({
          productId: item.productId,
          name: product.name,
         // image:product.images[0],
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
        userId: user._id,
        items: orderItems,
        couponCode: dto.couponCode ?? null,
        total: Math.round(total * 100) / 100,
        status: ORDER_STATUS.PENDING,
      },
    });

    await this.cartRepo.updateOne({
      filter: { userId: user._id },
      update: { $set: { items: [] } },
    });

    if (dto.provider === PAYMENT_PROVIDER.CASH_ON_DELIVERY) {
      const payment = await this.paymentRepo.create({
        data: {
          orderId: order._id,
          amount: total,
          provider: dto.provider,
          transactionRef: `COD-${order._id}-${Date.now()}`,
        },
      });
      order.status = ORDER_STATUS.CONFIRMED;
      await order.save();
      return {
        order,
        payment: {
          transactionRef: payment.transactionRef,
          amount: payment.amount,
        },
      };
    }
    // const session = this.paymentService.createCheckoutSession({
    //   mode: 'payment',
    //   metadata: { orderId: order._id.toString() },
    //   success_url: `${this.configService.get('CLIENT_URL') as string}/order/success`,
    //   cancel_url: `${this.configService.get('CLIENT_URL') as string}/order/fail`,
    //   customer_email: user.email,
    //   discounts: [],
    //   line_items: (cart.items as unknown as HydratedDocument<IProduct>[]).map((item) => {
    //     return {
    //       quantity: item.n,
    //       price_data: {
    //         currency: 'EGP',
    //         product_data:{
    //           name:item.,
    //           images:item.
    //         }
    //       },
    //     };
    //   }),
    // });
  }

  /*
cancel_url
success_url
line_items
customer_email
discount
mode
metadata
*/

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
