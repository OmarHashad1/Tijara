"use client";

import Link from "next/link";
import type { CartItem } from "@/lib/api/types";
import { formatPrice, salePriceOf } from "@/lib/format";
import { useRemoveCartItem, useUpdateCartItem } from "@/lib/hooks/use-cart";
import { ProductImage } from "@/components/product-image";
import { QuantityStepper } from "@/components/quantity-stepper";

/** cart-line-item token: plain hairline-divided row, no card chrome. */
export function CartLineItem({ item }: { item: CartItem }) {
  const product = item.productId;
  const updateMutation = useUpdateCartItem();
  const removeMutation = useRemoveCartItem();

  return (
    <div className="flex gap-4 border-b border-hairline-light py-3">
      <Link
        href={`/products/${product.slug}`}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-canvas-cream"
      >
        <ProductImage src={product.images[0]} alt={product.name} />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/products/${product.slug}`}
            className="type-body-strong truncate text-ink hover:underline"
          >
            {product.name}
          </Link>
          <span className="type-body-strong shrink-0 text-ink">
            {formatPrice(salePriceOf(product) * item.quantity)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <QuantityStepper
            quantity={item.quantity}
            maxQuantity={product.stock}
            disabled={updateMutation.isPending}
            onChange={(quantity) =>
              updateMutation.mutate({ productId: product._id, quantity })
            }
          />
          <button
            type="button"
            disabled={removeMutation.isPending}
            onClick={() => removeMutation.mutate(product._id)}
            className="type-caption text-shade-50 hover:text-ink hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
