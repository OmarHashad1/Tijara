import Link from "next/link";

/** Stripe checkout lands here on success (see server checkout success_url). */
export default function OrderSuccessPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="rounded-lg bg-pistachio px-6 py-20 text-center">
        <p className="type-eyebrow mb-4 text-shade-60">Payment received</p>
        <h1 className="type-display-md">Order confirmed 🎉</h1>
        <p className="type-body-md mx-auto mt-4 max-w-md text-shade-60">
          Your payment went through. We&apos;ll email you as your order moves
          through packing and shipping.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link href="/orders" className="btn-pill btn-primary">
            View my orders
          </Link>
          <Link href="/products" className="btn-pill btn-outline-on-light">
            Keep shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
