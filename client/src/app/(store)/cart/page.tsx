"use client";

import Link from "next/link";
import { useCart, useClearCart } from "@/lib/hooks/use-cart";
import { useUser } from "@/lib/hooks/use-user";
import { formatPrice, salePriceOf } from "@/lib/format";
import { CartLineItem } from "@/components/cart/cart-line-item";

export default function CartPage() {
  const { isLoggedIn, isPending: isUserPending } = useUser();
  const { data: cart, isPending } = useCart();
  const clearMutation = useClearCart();

  if (!isUserPending && !isLoggedIn) {
    return (
      <EmptyPanel
        title="Your cart lives here"
        body="Log in to add items and check out."
        cta={{ label: "Log in", href: "/login" }}
      />
    );
  }

  if (isPending || isUserPending) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="h-8 w-40 animate-pulse rounded bg-canvas-cream" />
        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded bg-canvas-cream" />
          ))}
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <EmptyPanel
        title="Your cart is empty"
        body="The shelf is full of things that would fix that."
        cta={{ label: "Continue shopping", href: "/products" }}
      />
    );
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + salePriceOf(item.productId) * item.quantity,
    0,
  );

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <div className="mb-8 flex items-baseline justify-between">
        <h1 className="type-display-lg">Cart</h1>
        <button
          type="button"
          disabled={clearMutation.isPending}
          onClick={() => clearMutation.mutate(undefined)}
          className="type-caption text-shade-50 hover:text-ink hover:underline"
        >
          Clear cart
        </button>
      </div>

      <div>
        {cart.items.map((item) => (
          <CartLineItem key={item.productId._id} item={item} />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <span className="type-heading-md">Subtotal</span>
        <span className="type-heading-md">{formatPrice(subtotal)}</span>
      </div>
      <p className="type-caption mt-1 text-shade-50">
        Shipping and any coupon are settled at checkout.
      </p>

      <Link href="/checkout" className="btn-pill btn-primary mt-8 w-full">
        Checkout
      </Link>
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
