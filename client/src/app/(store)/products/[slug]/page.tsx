"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { getProduct } from "@/lib/api/catalog";
import { formatPrice, salePriceOf } from "@/lib/format";
import { useUser } from "@/lib/hooks/use-user";
import { useAddCartItem } from "@/lib/hooks/use-cart";
import { useWishlist, useToggleWishlistItem } from "@/lib/hooks/use-wishlist";
import { useCartUi } from "@/lib/stores/cart-ui";
import { ProductGallery } from "@/components/pdp/product-gallery";
import { ProductReviews } from "@/components/pdp/product-reviews";
import { QuantityStepper } from "@/components/quantity-stepper";
import { Spinner } from "@/components/spinner";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  const { isLoggedIn } = useUser();
  const addCartMutation = useAddCartItem();
  const { contains } = useWishlist();
  const toggleWishlist = useToggleWishlistItem();
  const openDrawer = useCartUi((state) => state.openDrawer);

  const {
    data: product,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProduct(slug),
  });

  if (isPending) {
    return (
      <div className="mx-auto grid max-w-[1600px] gap-12 px-6 py-12 lg:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-lg bg-canvas-cream" />
        <div className="space-y-4 py-4">
          <div className="h-4 w-32 animate-pulse rounded bg-canvas-cream" />
          <div className="h-8 w-2/3 animate-pulse rounded bg-canvas-cream" />
          <div className="h-10 w-40 animate-pulse rounded bg-canvas-cream" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-lg bg-canvas-cream px-6 py-16 text-center">
          <p className="type-heading-md">This product is off the shelf</p>
          <p className="type-body-md mt-2 text-shade-50">
            It may have been removed, or the link is broken.
          </p>
          <Link href="/products" className="btn-pill btn-primary mt-8">
            Back to the catalog
          </Link>
        </div>
      </div>
    );
  }

  const sale = salePriceOf(product);
  const discounted = sale < product.price;
  const soldOut = product.stock === 0;
  const inWishlist = contains(product._id);

  function requireLogin(action: () => void) {
    if (!isLoggedIn) {
      toast.info("Log in to do that.");
      router.push("/login");
      return;
    }
    action();
  }

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-10 md:py-14">
      <nav aria-label="Breadcrumb" className="type-caption mb-8 text-shade-50">
        <Link href="/products" className="hover:text-ink hover:underline">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} productName={product.name} />

        <div className="max-w-xl">
          <h1 className="type-heading-xl">{product.name}</h1>

          <div className="mt-4 flex items-baseline gap-4">
            <span className="type-display-md">{formatPrice(sale)}</span>
            {discounted && (
              <>
                <span className="type-caption text-shade-50 line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="type-eyebrow rounded-full bg-aloe px-2.5 py-1 text-ink">
                  −{product.discountPercent}%
                </span>
              </>
            )}
          </div>

          <p className="type-caption mt-3">
            {soldOut ? (
              <span className="rounded-full bg-shade-30 px-2.5 py-1 text-shade-60">
                Sold out
              </span>
            ) : product.stock <= 5 ? (
              <span className="text-shade-50">
                Only {product.stock} left in stock
              </span>
            ) : (
              <span className="text-shade-50">In stock</span>
            )}
          </p>

          {product.description && (
            <p className="type-body-md mt-6 text-shade-60">
              {product.description}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <QuantityStepper
              quantity={quantity}
              maxQuantity={Math.max(product.stock, 1)}
              disabled={soldOut}
              onChange={setQuantity}
            />
            <button
              type="button"
              disabled={soldOut || addCartMutation.isPending}
              onClick={() =>
                requireLogin(() =>
                  addCartMutation.mutate(
                    { productId: product._id, quantity },
                    { onSuccess: openDrawer },
                  ),
                )
              }
              className="btn-pill btn-primary flex-1 sm:flex-none sm:px-10"
            >
              {soldOut ? (
                "Sold out"
              ) : addCartMutation.isPending ? (
                <Spinner />
              ) : (
                "Add to cart"
              )}
            </button>
            <button
              type="button"
              aria-pressed={inWishlist}
              disabled={toggleWishlist.isPending}
              onClick={() => requireLogin(() => toggleWishlist.mutate(product._id))}
              className="btn-pill btn-outline-on-light px-4!"
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                strokeWidth={1.5}
                className={`h-5 w-5 ${inWishlist ? "fill-ink" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>

      <ProductReviews productId={product._id} />
    </div>
  );
}
