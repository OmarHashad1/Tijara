
export interface ApiEnvelope<T> {
  status: "success";
  data: {
    message: string;
    payload?: T;
    data?: T; // user/customer module uses `data` instead of `payload`
  };
}

export interface PaginationMeta {
  count?: number;
  page?: number | string;
  size?: number | string;
  pages?: number;
}

export interface Paginated<T> {
  docs: T[];
  meta: PaginationMeta;
}

export interface Product {
  id: string;
  _id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  discountPercent?: number;
  salePrice?: number;
  stock: number;
  categoryId: string;
  brandId: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id?: string;
  _id: string;
  name: string;
  slug: string;
  logo?: string | null;
  description?: string | null;
  categoryIds?: string[];
}

/** Category comes from GraphQL (code-first schema, string ids). */
export interface Category {
  id: string;
  name: string;
  slug?: string | null;
  status?: "DRAFT" | "PUBLISHED" | "SUSPENDED" | null;
}

export type Role = "user" | "admin";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role: Role;
  isEmailVerified: boolean;
  status: string;
}

/** Cart/wishlist reads populate product refs with this trimmed selection. */
export type CartProduct = Pick<
  Product,
  | "_id"
  | "name"
  | "slug"
  | "price"
  | "discountPercent"
  | "stock"
  | "images"
  | "createdAt"
>;

export interface CartItem {
  productId: CartProduct;
  quantity: number;
}

export interface Cart {
  _id: string;
  items: CartItem[];
}

export interface Wishlist {
  _id: string;
  productIds: CartProduct[];
}

export interface Review {
  _id: string;
  rating: number;
  comment?: string;
  userId: { firstName?: string; lastName?: string } | string;
  createdAt: string;
}

export type OrderStatus =
  | "pending"
  | "shipped"
  | "confirmed"
  | "delivered"
  | "cancelled";

export type PaymentProvider = "stripe" | "cash_on_delivery";

export interface OrderItem {
  productId: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  couponCode?: string | null;
  total: number;
  paymentMethod: PaymentProvider;
  shippingAddress?: { city: string; country: string } | null;
  status: OrderStatus;
  paidAt?: string | null;
  createdAt: string;
}

/** Stripe checkout returns a session to redirect to; COD returns a payment ref. */
export interface CheckoutResult {
  order: Order;
  session?: { id: string; url: string };
  payment?: { transactionRef: string; amount: number };
}

export interface Coupon {
  _id: string;
  code: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  expiresAt: string;
  usageLimit: number;
  timesUsed: number;
}

export interface Address {
  _id: string;
  city: string;
  country: string;
  isDefault?: boolean;
}

export interface ListProductsParams {
  search?: string;
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
}
