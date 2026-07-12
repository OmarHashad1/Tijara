import { api, unwrap } from "./client";
import type {
  CheckoutResult,
  Coupon,
  Order,
  OrderStatus,
  Paginated,
  PaymentProvider,
} from "./types";

export async function checkout(input: {
  couponCode?: string;
  provider: PaymentProvider;
}): Promise<CheckoutResult> {
  const res = await api.post("/orders", input);
  return unwrap<CheckoutResult>(res.data);
}

export async function listOrders(
  params: { status?: OrderStatus; page?: number; size?: number } = {},
): Promise<Paginated<Order>> {
  const res = await api.get("/orders", { params });
  return unwrap<Paginated<Order>>(res.data);
}

export async function getOrder(orderId: string): Promise<Order> {
  const res = await api.get(`/orders/${orderId}`);
  return unwrap<Order>(res.data);
}

export async function cancelOrder(orderId: string) {
  await api.patch(`/orders/${orderId}/cancel`);
}

export async function validateCoupon(code: string): Promise<Coupon> {
  const res = await api.post("/coupons/validate", { code });
  return unwrap<Coupon>(res.data);
}

export async function createReview(input: {
  productId: string;
  orderId: string;
  rating: number;
  comment?: string;
}) {
  const { productId, ...body } = input;
  await api.post(`/products/${productId}/reviews`, body);
}
