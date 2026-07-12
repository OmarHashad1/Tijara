import { api, unwrap } from "./client";
import type { Cart } from "./types";

export async function getCart(): Promise<Cart> {
  const res = await api.get("/cart");
  return unwrap<Cart>(res.data);
}

export async function addCartItem(input: {
  productId: string;
  quantity: number;
}) {
  await api.post("/cart/items", input);
}

export async function updateCartItem(input: {
  productId: string;
  quantity: number;
}) {
  await api.patch(`/cart/items/${input.productId}`, {
    quantity: input.quantity,
  });
}

export async function removeCartItem(productId: string) {
  await api.delete(`/cart/items/${productId}`);
}

export async function clearCart() {
  await api.delete("/cart");
}
