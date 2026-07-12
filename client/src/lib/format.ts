const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export function formatPrice(value: number): string {
  return currency.format(value);
}

/** Sale price falls back to deriving from discountPercent when absent. */
export function salePriceOf(product: {
  price: number;
  salePrice?: number;
  discountPercent?: number;
}): number {
  if (typeof product.salePrice === "number") return product.salePrice;
  const discount = product.discountPercent ?? 0;
  return discount > 0 ? product.price * (1 - discount / 100) : product.price;
}

const NEW_BADGE_WINDOW_DAYS = 30;

export function isNewProduct(createdAt: string): boolean {
  const ageMs = Date.now() - new Date(createdAt).getTime();
  return ageMs < NEW_BADGE_WINDOW_DAYS * 24 * 60 * 60 * 1000;
}
