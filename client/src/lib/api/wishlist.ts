import { api, unwrap } from "./client";
import type { Wishlist } from "./types";

export async function getWishlist(): Promise<Wishlist> {
  const res = await api.get("/wishlist");
  return unwrap<Wishlist>(res.data);
}

export async function addWishlistItem(productId: string) {
  await api.post("/wishlist/items", { productId });
}

export async function removeWishlistItem(productId: string) {
  await api.delete(`/wishlist/items/${productId}`);
}
