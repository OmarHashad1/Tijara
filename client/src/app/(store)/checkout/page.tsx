"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { checkout, validateCoupon } from "@/lib/api/orders";
import { listAddresses, listPaymentMethods } from "@/lib/api/account";
import { apiErrorMessage } from "@/lib/api/client";
import type { Coupon, PaymentProvider } from "@/lib/api/types";
import { formatPrice, salePriceOf } from "@/lib/format";
import { useCart } from "@/lib/hooks/use-cart";
import { useUser } from "@/lib/hooks/use-user";
import { ProductImage } from "@/components/product-image";
import { Spinner } from "@/components/spinner";

function discountedTotal(subtotal: number, coupon: Coupon | null): number {
  if (!coupon) return subtotal;
  if (coupon.discountType === "percent")
    return subtotal * (1 - coupon.discountValue / 100);
  return Math.max(0, subtotal - coupon.discountValue);
}

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isLoggedIn, isPending: isUserPending } = useUser();
  const { data: cart } = useCart();

  const [provider, setProvider] = useState<PaymentProvider>("cash_on_delivery");
  const [couponDraft, setCouponDraft] = useState("");
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const { data: addresses } = useQuery({
    queryKey: ["addresses"],
    queryFn: listAddresses,
    enabled: isLoggedIn,
  });
  const { data: paymentMethods } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: listPaymentMethods,
    enabled: isLoggedIn,
  });

  const couponMutation = useMutation({
    mutationFn: validateCoupon,
    onSuccess: (validated) => {
      setCoupon(validated);
      toast.success(`Coupon ${validated.code} applied.`);
    },
    onError: (error) => {
      setCoupon(null);
      toast.error(apiErrorMessage(error));
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: checkout,
    onSuccess: (result) => {
      // The backend empties the cart once the order is placed.
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      if (result.session?.url) {
        // Stripe-hosted payment page takes it from here.
        window.location.assign(result.session.url);
        return;
      }
      toast.success("Order placed — thank you!");
      router.push(`/orders/${result.order._id}`);
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  if (!isUserPending && !isLoggedIn) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-lg bg-canvas-cream px-6 py-16 text-center">
          <p className="type-heading-md">Checkout needs an account</p>
          <p className="type-body-md mt-2 text-shade-50">
            Log in to place your order.
          </p>
          <Link href="/login" className="btn-pill btn-primary mt-8">
            Log in
          </Link>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-lg bg-canvas-cream px-6 py-16 text-center">
          <p className="type-heading-md">Nothing to check out</p>
          <p className="type-body-md mt-2 text-shade-50">
            Your cart is empty — add something first.
          </p>
          <Link href="/products" className="btn-pill btn-primary mt-8">
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + salePriceOf(item.productId) * item.quantity,
    0,
  );
  const total = discountedTotal(subtotal, coupon);

  return (
    <div className="mx-auto max-w-300 px-6 py-12 md:py-16">
      <h1 className="type-display-lg mb-10">Checkout</h1>

      <div className="grid gap-12 lg:grid-cols-[1fr_420px]">
        <div className="space-y-10">
          {/* Shipping address — confirmation only; the order API doesn't take
              an addressId yet (backend gap, flagged rather than invented). */}
          <section>
            <h2 className="type-heading-md mb-4">Shipping address</h2>
            {!addresses?.length ? (
              <div className="rounded-lg bg-canvas-cream p-6">
                <p className="type-body-md text-shade-50">
                  No addresses on your profile yet.
                </p>
                <Link
                  href="/account/addresses"
                  className="type-caption mt-2 inline-block text-ink underline underline-offset-2"
                >
                  Add an address →
                </Link>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {addresses.map((address) => {
                  const selected =
                    selectedAddressId === address._id ||
                    (!selectedAddressId && address.isDefault);
                  return (
                    <button
                      key={address._id}
                      type="button"
                      onClick={() => setSelectedAddressId(address._id)}
                      className={`rounded-lg border p-4 text-left transition-colors ${
                        selected
                          ? "border-ink bg-canvas-light"
                          : "border-hairline-light bg-canvas-light hover:border-shade-40"
                      }`}
                    >
                      <p className="type-body-strong">{address.city}</p>
                      <p className="type-caption text-shade-50">
                        {address.country}
                      </p>
                      {address.isDefault && (
                        <span className="type-eyebrow mt-2 inline-block rounded-full bg-shade-30 px-2 py-0.5">
                          Default
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* Payment */}
          <section>
            <h2 className="type-heading-md mb-4">Payment</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setProvider("cash_on_delivery")}
                className={`rounded-lg border p-4 text-left transition-colors ${
                  provider === "cash_on_delivery"
                    ? "border-ink"
                    : "border-hairline-light hover:border-shade-40"
                }`}
              >
                <p className="type-body-strong">Cash on delivery</p>
                <p className="type-caption text-shade-50">
                  Pay when the order arrives.
                </p>
              </button>
              <button
                type="button"
                onClick={() => setProvider("stripe")}
                className={`rounded-lg border p-4 text-left transition-colors ${
                  provider === "stripe"
                    ? "border-ink"
                    : "border-hairline-light hover:border-shade-40"
                }`}
              >
                <p className="type-body-strong">Card (Stripe)</p>
                <p className="type-caption text-shade-50">
                  You&apos;ll be redirected to a secure payment page.
                  {paymentMethods?.length
                    ? ` ${paymentMethods.length} saved card${paymentMethods.length > 1 ? "s" : ""} on file.`
                    : ""}
                </p>
              </button>
            </div>
          </section>

          {/* Coupon */}
          <section>
            <h2 className="type-heading-md mb-4">Coupon</h2>
            <div className="flex gap-3">
              <input
                type="text"
                value={couponDraft}
                onChange={(e) => setCouponDraft(e.target.value.toUpperCase())}
                placeholder="CODE"
                className="type-body-md min-h-11 w-48 rounded-md border border-hairline-light bg-canvas-light px-3 py-2.5 uppercase text-ink outline-none placeholder:text-shade-40 focus:border-ink"
              />
              <button
                type="button"
                disabled={!couponDraft || couponMutation.isPending}
                onClick={() => couponMutation.mutate(couponDraft)}
                className="btn-pill btn-outline-on-light px-5!"
              >
                {couponMutation.isPending ? <Spinner /> : "Apply"}
              </button>
              {coupon && (
                <button
                  type="button"
                  onClick={() => {
                    setCoupon(null);
                    setCouponDraft("");
                  }}
                  className="type-caption self-center text-shade-50 hover:text-ink hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
            {coupon && (
              <p className="type-caption mt-2 text-shade-50">
                {coupon.code}:{" "}
                {coupon.discountType === "percent"
                  ? `−${coupon.discountValue}%`
                  : `−${formatPrice(coupon.discountValue)}`}
              </p>
            )}
          </section>
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-lg border border-hairline-light bg-canvas-cream p-6">
          <h2 className="type-heading-md mb-5">Order summary</h2>
          <ul className="space-y-4">
            {cart.items.map((item) => (
              <li key={item.productId._id} className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-canvas-light">
                  <ProductImage
                    src={item.productId.images[0]}
                    alt={item.productId.name}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="type-caption truncate text-ink">
                    {item.productId.name}
                  </p>
                  <p className="type-micro text-shade-50">× {item.quantity}</p>
                </div>
                <span className="type-caption text-ink">
                  {formatPrice(salePriceOf(item.productId) * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 space-y-2 border-t border-hairline-light pt-4">
            <div className="flex justify-between">
              <span className="type-caption text-shade-50">Subtotal</span>
              <span className="type-caption">{formatPrice(subtotal)}</span>
            </div>
            {coupon && (
              <div className="flex justify-between">
                <span className="type-caption text-shade-50">Coupon</span>
                <span className="type-caption">
                  −{formatPrice(subtotal - total)}
                </span>
              </div>
            )}
            <div className="flex justify-between pt-2">
              <span className="type-heading-md">Total</span>
              <span className="type-heading-md">{formatPrice(total)}</span>
            </div>
          </div>

          <button
            type="button"
            disabled={checkoutMutation.isPending}
            onClick={() =>
              checkoutMutation.mutate({
                provider,
                couponCode: coupon?.code,
              })
            }
            className="btn-pill btn-primary mt-6 w-full"
          >
            {checkoutMutation.isPending ? (
              <Spinner />
            ) : provider === "stripe" ? (
              "Pay with card"
            ) : (
              "Place order"
            )}
          </button>
        </aside>
      </div>
    </div>
  );
}
