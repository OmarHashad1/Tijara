"use client";

import Link from "next/link";
import { useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { adminListOrders, adminUpdateOrderStatus } from "@/lib/api/admin";
import { apiErrorMessage } from "@/lib/api/client";
import type { OrderStatus } from "@/lib/api/types";
import { formatPrice } from "@/lib/format";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { CatalogPagination } from "@/components/catalog/catalog-pagination";

const STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [page, setPage] = useState(1);

  const { data, isPending } = useQuery({
    queryKey: ["admin", "orders", status, page],
    queryFn: () =>
      adminListOrders({
        status: status === "all" ? undefined : status,
        page,
        size: 15,
      }),
    placeholderData: keepPreviousData,
  });

  const statusMutation = useMutation({
    mutationFn: adminUpdateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      toast.success("Order status updated.");
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  return (
    <>
      <header className="mb-8">
        <h1 className="type-display-md">Orders</h1>
      </header>

      <div className="mb-6 flex flex-wrap gap-2">
        {(["all", ...STATUSES] as const).map((filter) => (
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

      <div className="overflow-x-auto rounded-lg border border-hairline-light bg-canvas-light">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-hairline-light">
              {["Order", "Placed", "Items", "Total", "Status", "Move to"].map(
                (heading) => (
                  <th key={heading} className="type-eyebrow px-4 py-3 text-shade-50">
                    {heading}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline-light">
            {isPending
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-4 py-4">
                      <div className="h-5 animate-pulse rounded bg-canvas-cream" />
                    </td>
                  </tr>
                ))
              : data?.docs.map((order) => (
                  <tr key={order._id}>
                    <td className="type-caption px-4 py-3">
                      <Link
                        href={`/orders/${order._id}`}
                        className="hover:underline"
                      >
                        #{order._id.slice(-8).toUpperCase()}
                      </Link>
                    </td>
                    <td className="type-caption px-4 py-3 text-shade-50">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="type-caption px-4 py-3">
                      {order.items.length}
                    </td>
                    <td className="type-caption px-4 py-3">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        aria-label={`Change status of order ${order._id}`}
                        value={order.status}
                        disabled={statusMutation.isPending}
                        onChange={(e) =>
                          statusMutation.mutate({
                            orderId: order._id,
                            status: e.target.value as OrderStatus,
                          })
                        }
                        className="type-caption rounded-md border border-hairline-light bg-canvas-light px-2 py-1.5 outline-none focus:border-ink"
                      >
                        {STATUSES.map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
        {data && data.docs.length === 0 && (
          <p className="type-caption px-4 py-8 text-center text-shade-50">
            No orders match this filter.
          </p>
        )}
      </div>

      {data && (
        <CatalogPagination
          meta={data.meta}
          currentPage={page}
          onPageChange={setPage}
        />
      )}
    </>
  );
}
