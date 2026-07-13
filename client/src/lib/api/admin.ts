import { api, unwrap } from "./client";
import type {
  Brand,
  Coupon,
  Order,
  OrderStatus,
  Paginated,
  Product,
  Review,
  Role,
} from "./types";

/** The user/admin module returns results bare (no message/payload keys). */
function unwrapBare<T>(body: { data: T }): T {
  return body.data;
}

export interface AdminUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  status: string;
  isEmailVerified: boolean;
  deletedAt?: string | null;
  banReason?: string | null;
  createdAt: string;
}

/* ---- Users ---- */

export async function adminListUsers(
  params: {
    search?: string;
    status?: string;
    role?: Role;
    page?: number;
    size?: number;
  } = {},
): Promise<Paginated<AdminUser>> {
  const res = await api.get("/admin/users", { params });
  return unwrapBare<Paginated<AdminUser>>(res.data);
}

export async function adminBanUser(input: { userId: string; banReason: string }) {
  await api.patch(`/admin/users/${input.userId}/ban`, {
    banReason: input.banReason,
  });
}

export async function adminUnbanUser(userId: string) {
  await api.patch(`/admin/users/${userId}/unban`);
}

export async function adminSoftDeleteUser(userId: string) {
  await api.delete(`/admin/users/${userId}`);
}

export async function adminHardDeleteUser(userId: string) {
  await api.delete(`/admin/users/${userId}/hard`);
}

export async function adminRestoreUser(userId: string) {
  await api.patch(`/admin/users/${userId}/restore`);
}

/* ---- Orders ---- */

export async function adminListOrders(
  params: {
    status?: OrderStatus;
    userId?: string;
    page?: number;
    size?: number;
  } = {},
): Promise<Paginated<Order & { userId: string }>> {
  const res = await api.get("/admin/orders", { params });
  return unwrap<Paginated<Order & { userId: string }>>(res.data);
}

export async function adminUpdateOrderStatus(input: {
  orderId: string;
  status: OrderStatus;
}) {
  await api.patch(`/admin/orders/${input.orderId}/status`, {
    status: input.status,
  });
}

/* ---- Reviews ---- */

export async function adminListReviews(
  params: {
    productId?: string;
    userId?: string;
    rating?: number;
    page?: number;
    size?: number;
  } = {},
): Promise<Paginated<Review & { productId: string }>> {
  const res = await api.get("/admin/reviews", { params });
  return unwrap<Paginated<Review & { productId: string }>>(res.data);
}

export async function adminDeleteReview(reviewId: string) {
  await api.delete(`/admin/reviews/${reviewId}`);
}

/* ---- Coupons ---- */

export interface CouponInput {
  code: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  expiresAt: string;
  usageLimit: number;
}

export async function adminListCoupons(
  params: { search?: string; page?: number; size?: number } = {},
): Promise<Paginated<Coupon>> {
  const res = await api.get("/admin/coupons", { params });
  return unwrap<Paginated<Coupon>>(res.data);
}

export async function adminCreateCoupon(input: CouponInput) {
  await api.post("/admin/coupons", input);
}

export async function adminUpdateCoupon(input: {
  couponId: string;
  changes: Partial<CouponInput>;
}) {
  await api.patch(`/admin/coupons/${input.couponId}`, input.changes);
}

export async function adminDeleteCoupon(couponId: string) {
  await api.delete(`/admin/coupons/${couponId}`);
}

/* ---- Products (multipart: images field, ≤10 files) ---- */

export interface ProductInput {
  name: string;
  description?: string;
  price: number;
  discountPercent?: number;
  stock?: number;
  categoryId: string;
  brandId: string;
}

function productFormData(
  input: Partial<ProductInput>,
  images: File[],
): FormData {
  const form = new FormData();
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined && value !== "") form.append(key, String(value));
  }
  for (const image of images) form.append("images", image);
  return form;
}

export async function adminCreateProduct(input: {
  fields: ProductInput;
  images: File[];
}): Promise<Product> {
  const res = await api.post(
    "/admin/products",
    productFormData(input.fields, input.images),
  );
  return unwrap<Product>(res.data);
}

export async function adminUpdateProduct(input: {
  productId: string;
  fields: Partial<ProductInput>;
  images: File[];
}) {
  await api.patch(
    `/admin/products/${input.productId}`,
    productFormData(input.fields, input.images),
  );
}

export async function adminAdjustStock(input: {
  productId: string;
  quantity: number;
}) {
  await api.patch(`/admin/products/${input.productId}/stock`, {
    quantity: input.quantity,
  });
}

export async function adminDeleteProduct(productId: string) {
  await api.delete(`/admin/products/${productId}`);
}

/* ---- Brands (multipart: logo field, single file) ---- */

export interface BrandInput {
  name: string;
  description?: string;
  categoryIds: string[];
}

function brandFormData(input: Partial<BrandInput>, logo?: File): FormData {
  const form = new FormData();
  if (input.name) form.append("name", input.name);
  if (input.description) form.append("description", input.description);
  for (const categoryId of input.categoryIds ?? []) {
    form.append("categoryIds[]", categoryId);
  }
  if (logo) form.append("logo", logo);
  return form;
}

export async function adminCreateBrand(input: {
  fields: BrandInput;
  logo?: File;
}): Promise<Brand> {
  const res = await api.post(
    "/admin/brands",
    brandFormData(input.fields, input.logo),
  );
  return unwrap<Brand>(res.data);
}

export async function adminUpdateBrand(input: {
  brandId: string;
  fields: Partial<BrandInput>;
  logo?: File;
}) {
  await api.patch(
    `/admin/brands/${input.brandId}`,
    brandFormData(input.fields, input.logo),
  );
}

export async function adminDeleteBrand(brandId: string) {
  await api.delete(`/admin/brands/${brandId}`);
}
