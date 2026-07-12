import Link from "next/link";
import type { Product } from "@/lib/api/types";
import { formatPrice, isNewProduct, salePriceOf } from "@/lib/format";
import { ProductImage } from "./product-image";

/**
 * product-card (Design_Guide): flat at rest, Level-2 elevation on hover only.
 * Image sits in a cream product-image-frame; badges pin over the top-left.
 */
export function ProductCard({ product }: { product: Product }) {
  const soldOut = product.stock === 0;
  const sale = salePriceOf(product);
  const discounted = sale < product.price;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block rounded-lg bg-canvas-light p-4 transition-shadow duration-200 hover:shadow-card-hover"
    >
      <div className="relative aspect-square overflow-hidden rounded-md bg-canvas-cream">
        <ProductImage src={product.images[0]} alt={product.name} />
        {soldOut ? (
          <span className="type-eyebrow absolute left-3 top-3 rounded-full bg-shade-30 px-2.5 py-1 text-shade-60">
            Sold out
          </span>
        ) : isNewProduct(product.createdAt) ? (
          <span className="type-eyebrow absolute left-3 top-3 rounded-full bg-aloe px-2.5 py-1 text-ink">
            New
          </span>
        ) : null}
      </div>

      <div className="pt-4">
        <h3 className="type-heading-sm text-ink">{product.name}</h3>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="type-body-strong text-ink">{formatPrice(sale)}</span>
          {discounted && (
            <span className="type-caption text-shade-50 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
