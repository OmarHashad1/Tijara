"use client";

import Link from "next/link";
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listOrders } from "@/lib/api/orders";
import type { OrderStatus } from "@/lib/api/types";
import { formatPrice } from "@/lib/format";
import { useUser } from "@/lib/hooks/use-user";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { CatalogPagination } from "@/components/catalog/catalog-pagination";

const STATUS_FILTERS: (OrderStatus | "all")[] = [
  "all",
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

export default function OrdersPage() {
  const { isLoggedIn, isPending: isUserPending } = useUser();
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [page, setPage] = useState(1);

  const { data, isPending } = useQuery({
    queryKey: ["orders", status, page],
    queryFn: () =>
      listOrders({
        status: status === "all" ? undefined : status,
        page,
        size: 10,
      }),
    enabled: isLoggedIn,
    placeholderData: keepPreviousData,
  });

  if (!isUserPending && !isLoggedIn) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-lg bg-canvas-cream px-6 py-16 text-center">
          <p className="type-heading-md">Your orders live here</p>
          <p className="type-body-md mt-2 text-shade-50">
            Log in to see your order history.
          </p>
          <Link href="/login" className="btn-pill btn-primary mt-8">
            Log in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 md:py-16">
      <h1 className="type-display-lg mb-8">Orders</h1>

      <div className="mb-8 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => {
              setStatus(filter);
              setPage(1);
            }}
            className={`type-eyebrow rounded-full px-3.5 py-2 transition-colors ${
              status === filter
                ? "bg-aloe text-ink"
                : "bg-shade-30 text-ink hover:bg-aloe/60"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {isPending || isUserPending ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-canvas-cream" />
          ))}
        </div>
      ) : !data || data.docs.length === 0 ? (
        <div className="rounded-lg bg-canvas-cream px-6 py-16 text-center">
          <p className="type-heading-md">No orders here yet</p>
          <p className="type-body-md mt-2 text-shade-50">
            When you place an order it shows up on this shelf.
          </p>
          <Link href="/products" className="btn-pill btn-primary mt-8">
            Start shopping
          </Link>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-hairline-light">
            {data.docs.map((order) => (
              <li key={order._id}>
                <Link
                  href={`/orders/${order._id}`}
                  className="flex flex-wrap items-center justify-between gap-4 py-5 transition-colors hover:bg-canvas-cream/60"
                >
                  <div>
                    <p className="type-body-strong">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="type-caption text-shade-50">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      · {order.items.length} item
                      {order.items.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <OrderStatusBadge status={order.status} />
                    <span className="type-body-strong">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <CatalogPagination
            meta={data.meta}
            currentPage={page}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
