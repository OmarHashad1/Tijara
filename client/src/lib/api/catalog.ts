import { api, unwrap } from "./client";
import type {
  Brand,
  ListProductsParams,
  Paginated,
  Product,
  Review,
} from "./types";

export async function listProducts(
  params: ListProductsParams = {},
): Promise<Paginated<Product>> {
  const res = await api.get("/products", { params });
  return unwrap<Paginated<Product>>(res.data);
}

export async function getProduct(slug: string): Promise<Product> {
  const res = await api.get(`/products/${slug}`);
  return unwrap<Product>(res.data);
}

export async function listProductReviews(
  productId: string,
  params: { page?: number; size?: number } = {},
): Promise<Paginated<Review>> {
  const res = await api.get(`/products/${productId}/reviews`, { params });
  return unwrap<Paginated<Review>>(res.data);
}

export async function listBrands(): Promise<Brand[]> {
  const res = await api.get("/brands");
  return unwrap<Brand[]>(res.data);
}

export async function getBrand(slug: string): Promise<Brand> {
  const res = await api.get(`/brands/${slug}`);
  return unwrap<Brand>(res.data);
}
