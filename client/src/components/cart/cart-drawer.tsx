"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useCart } from "@/lib/hooks/use-cart";
import { useUser } from "@/lib/hooks/use-user";
import { useCartUi } from "@/lib/stores/cart-ui";
import { formatPrice, salePriceOf } from "@/lib/format";
import { CartLineItem } from "./cart-line-item";

function DrawerBody() {
  const { isLoggedIn } = useUser();
  const { data: cart, isPending } = useCart();
  const closeDrawer = useCartUi((state) => state.closeDrawer);

  if (!isLoggedIn) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-lg bg-canvas-cream px-6 py-16 text-center">
        <p className="type-heading-md">Your cart lives here</p>
        <p className="type-body-md text-shade-50">
          Log in to add items and check out.
        </p>
        <Link
          href="/login"
          onClick={closeDrawer}
          className="btn-pill btn-primary mt-2"
        >
          Log in
        </Link>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex-1 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex animate-pulse gap-4 py-3">
            <div className="h-20 w-20 rounded-md bg-canvas-cream" />
            <div className="flex-1 space-y-3 py-1">
              <div className="h-4 w-2/3 rounded bg-canvas-cream" />
              <div className="h-4 w-1/3 rounded bg-canvas-cream" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-lg bg-canvas-cream px-6 py-16 text-center">
        <p className="type-heading-md">Your cart is empty</p>
        <p className="type-body-md text-shade-50">
          The shelf is full of things that would fix that.
        </p>
        <Link
          href="/products"
          onClick={closeDrawer}
          className="btn-pill btn-primary mt-2"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + salePriceOf(item.productId) * item.quantity,
    0,
  );

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        {cart.items.map((item) => (
          <CartLineItem key={item.productId._id} item={item} />
        ))}
      </div>

      <div className="border-t border-hairline-light pt-5">
        <div className="mb-5 flex items-center justify-between">
          <span className="type-heading-md">Subtotal</span>
          <span className="type-heading-md">{formatPrice(subtotal)}</span>
        </div>
        <div className="grid gap-3">
          <Link
            href="/checkout"
            onClick={closeDrawer}
            className="btn-pill btn-primary w-full"
          >
            Checkout
          </Link>
          <Link
            href="/cart"
            onClick={closeDrawer}
            className="btn-pill btn-outline-on-light w-full"
          >
            View full cart
          </Link>
        </div>
      </div>
    </>
  );
}

/** cart-drawer token: right slide-in panel, Level 4 elevation, light canvas. */
export function CartDrawer() {
  const isDrawerOpen = useCartUi((state) => state.isDrawerOpen);
  const closeDrawer = useCartUi((state) => state.closeDrawer);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close cart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-50 cursor-default bg-ink/40"
          />
          <motion.aside
            role="dialog"
            aria-label="Shopping cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="fixed right-0 top-0 z-50 flex h-dvh w-full max-w-md flex-col bg-canvas-light p-6 shadow-elev-4"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="type-heading-xl">Cart</h2>
              <button
                type="button"
                aria-label="Close"
                onClick={closeDrawer}
                className="rounded-full p-2 transition-opacity hover:opacity-60"
              >
                <X strokeWidth={1.5} className="h-5 w-5" />
              </button>
            </div>
            <DrawerBody />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
