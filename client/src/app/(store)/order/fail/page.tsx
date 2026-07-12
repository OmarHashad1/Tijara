import Link from "next/link";

/** Stripe checkout lands here when payment is cancelled or fails. */
export default function OrderFailPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="rounded-lg bg-canvas-cream px-6 py-20 text-center">
        <p className="type-eyebrow mb-4 text-shade-60">Payment not completed</p>
        <h1 className="type-display-md">That didn&apos;t go through</h1>
        <p className="type-body-md mx-auto mt-4 max-w-md text-shade-60">
          Your card wasn&apos;t charged. Your cart is safe — you can try again
          or pick cash on delivery instead.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link href="/checkout" className="btn-pill btn-primary">
            Try again
          </Link>
          <Link href="/cart" className="btn-pill btn-outline-on-light">
            Back to cart
          </Link>
        </div>
      </div>
    </div>
  );
}
