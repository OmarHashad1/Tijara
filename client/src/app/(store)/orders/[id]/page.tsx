"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { cancelOrder, createReview, getOrder } from "@/lib/api/orders";
import { apiErrorMessage } from "@/lib/api/client";
import type { OrderItem } from "@/lib/api/types";
import { formatPrice } from "@/lib/format";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { Spinner } from "@/components/spinner";

const CANCELLABLE_STATUSES = ["pending", "confirmed"];

function ReviewForm({ item, orderId }: { item: OrderItem; orderId: string }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const reviewMutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      toast.success("Review posted — thanks!");
      setOpen(false);
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="type-caption text-shade-50 underline underline-offset-2 hover:text-ink"
      >
        Leave a review
      </button>
    );
  }

  return (
    <div className="mt-3 rounded-lg bg-canvas-cream p-4">
      <div className="flex gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={rating === value}
            aria-label={`${value} star${value > 1 ? "s" : ""}`}
            onClick={() => setRating(value)}
          >
            <Star
              strokeWidth={1.5}
              className={`h-5 w-5 ${
                value <= rating ? "fill-ink text-ink" : "text-shade-40"
              }`}
            />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="What did you think? (optional)"
        rows={2}
        maxLength={1024}
        className="type-body-md mt-3 w-full rounded-md border border-hairline-light bg-canvas-light px-3 py-2.5 text-ink outline-none placeholder:text-shade-40 focus:border-ink"
      />
      <div className="mt-3 flex gap-3">
        <button
          type="button"
          disabled={reviewMutation.isPending}
          onClick={() =>
            reviewMutation.mutate({
              productId: item.productId,
              orderId,
              rating,
              comment: comment || undefined,
            })
          }
          className="btn-pill btn-primary px-5! py-2!"
        >
          {reviewMutation.isPending ? <Spinner /> : "Post review"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="type-caption text-shade-50 hover:text-ink hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const {
    data: order,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrder(id),
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order cancelled.");
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  if (isPending) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-6 py-16">
        <div className="h-8 w-56 animate-pulse rounded bg-canvas-cream" />
        <div className="h-40 animate-pulse rounded-lg bg-canvas-cream" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-lg bg-canvas-cream px-6 py-16 text-center">
          <p className="type-heading-md">Order not found</p>
          <Link href="/orders" className="btn-pill btn-primary mt-8">
            Back to orders
          </Link>
        </div>
      </div>
    );
  }

  const cancellable = CANCELLABLE_STATUSES.includes(order.status);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <nav aria-label="Breadcrumb" className="type-caption mb-8 text-shade-50">
        <Link href="/orders" className="hover:text-ink hover:underline">
          Orders
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">#{order._id.slice(-8).toUpperCase()}</span>
      </nav>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="type-heading-xl">
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>
          <p className="type-caption mt-1 text-shade-50">
            Placed{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            ·{" "}
            {order.paymentMethod === "stripe" ? "Card" : "Cash on delivery"}
            {order.shippingAddress &&
              ` · Ships to ${order.shippingAddress.city}, ${order.shippingAddress.country}`}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <ul className="divide-y divide-hairline-light border-y border-hairline-light">
        {order.items.map((item) => (
          <li key={`${item.productId}-${item.name}`} className="py-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="type-body-strong">{item.name}</p>
                <p className="type-caption text-shade-50">
                  {formatPrice(item.price)} × {item.quantity}
                </p>
              </div>
              <span className="type-body-strong">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
            {order.status === "delivered" && (
              <ReviewForm item={item} orderId={order._id} />
            )}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between">
        <span className="type-heading-md">Total</span>
        <span className="type-heading-md">{formatPrice(order.total)}</span>
      </div>
      {order.couponCode && (
        <p className="type-caption mt-1 text-shade-50">
          Coupon applied: {order.couponCode}
        </p>
      )}

      {cancellable && (
        <button
          type="button"
          disabled={cancelMutation.isPending}
          onClick={() => cancelMutation.mutate()}
          className="btn-pill btn-outline-on-light mt-10"
        >
          {cancelMutation.isPending ? <Spinner /> : "Cancel order"}
        </button>
      )}
    </div>
  );
}
