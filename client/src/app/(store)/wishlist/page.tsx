"use client";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { removeWishlistItem } from "@/lib/api/wishlist";
import { apiErrorMessage } from "@/lib/api/client";
import { formatPrice, salePriceOf } from "@/lib/format";
import { useUser } from "@/lib/hooks/use-user";
import { useWishlist } from "@/lib/hooks/use-wishlist";
import { ProductImage } from "@/components/product-image";

export default function WishlistPage() {
  const { isLoggedIn, isPending: isUserPending } = useUser();
  const { data: wishlist, isPending } = useWishlist();
  const queryClient = useQueryClient();

  const removeMutation = useMutation({
    mutationFn: removeWishlistItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Removed from wishlist.");
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  if (!isUserPending && !isLoggedIn) {
    return (
      <EmptyPanel
        title="Your wishlist lives here"
        body="Log in to save items for later."
        cta={{ label: "Log in", href: "/login" }}
      />
    );
  }

  if (isPending || isUserPending) {
    return (
      <div className="mx-auto max-w-[1600px] px-6 py-16">
        <div className="h-8 w-48 animate-pulse rounded bg-canvas-cream" />
        <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-lg bg-canvas-cream" />
          ))}
        </div>
      </div>
    );
  }

  if (!wishlist || wishlist.productIds.length === 0) {
    return (
      <EmptyPanel
        title="Nothing saved yet"
        body="Tap the heart on any product to keep it here."
        cta={{ label: "Browse products", href: "/products" }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-12 md:py-16">
      <h1 className="type-display-lg mb-10">Wishlist</h1>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {wishlist.productIds.map((product) => (
          <div key={product._id}>
            <Link
              href={`/products/${product.slug}`}
              className="group block rounded-lg bg-canvas-light p-4 transition-shadow duration-200 hover:shadow-card-hover"
            >
              <div className="relative aspect-square overflow-hidden rounded-md bg-canvas-cream">
                <ProductImage src={product.images[0]} alt={product.name} />
              </div>
              <div className="pt-4">
                <h3 className="type-heading-sm text-ink">{product.name}</h3>
                <p className="type-body-strong mt-1.5 text-ink">
                  {formatPrice(salePriceOf(product))}
                </p>
              </div>
            </Link>
            <button
              type="button"
              disabled={removeMutation.isPending}
              onClick={() => removeMutation.mutate(product._id)}
              className="type-caption mt-1 px-4 text-shade-50 hover:text-ink hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyPanel({
  title,
  body,
  cta,
}: {
  title: string;
  body: string;
  cta: { label: string; href: string };
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="rounded-lg bg-canvas-cream px-6 py-16 text-center">
        <p className="type-heading-md">{title}</p>
        <p className="type-body-md mt-2 text-shade-50">{body}</p>
        <Link href={cta.href} className="btn-pill btn-primary mt-8">
          {cta.label}
        </Link>
      </div>
    </div>
  );
}
