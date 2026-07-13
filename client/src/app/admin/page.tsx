"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { adminListOrders } from "@/lib/api/admin";
import { listProducts } from "@/lib/api/catalog";
import { formatPrice } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/api/types";

/**
 * There is no analytics endpoint — these visuals aggregate the most recent
 * orders/products client-side (flagged in the spec as a known gap, so the
 * numbers describe the fetched window, not all-time totals).
 */
const SAMPLE_SIZE = 100;
const LOW_STOCK_THRESHOLD = 5;

const STATUS_ORDER: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

function revenueByDay(orders: Order[]) {
  const perDay = new Map<string, number>();
  for (const order of orders) {
    if (order.status === "cancelled") continue;
    const day = new Date(order.createdAt).toISOString().slice(0, 10);
    perDay.set(day, (perDay.get(day) ?? 0) + order.total);
  }
  return [...perDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, revenue]) => ({
      day: day.slice(5),
      revenue: Math.round(revenue * 100) / 100,
    }));
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-hairline-light bg-canvas-light p-5">
      <p className="type-eyebrow text-shade-50">{label}</p>
      <p className="type-heading-xl mt-2">{value}</p>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-hairline-light bg-canvas-light p-5">
      <h2 className="type-heading-md mb-4">{title}</h2>
      <div className="h-64">{children}</div>
    </div>
  );
}

export default function AdminOverviewPage() {
  const { data: orders } = useQuery({
    queryKey: ["admin", "orders", "overview"],
    queryFn: () => adminListOrders({ page: 1, size: SAMPLE_SIZE }),
  });
  const { data: products } = useQuery({
    queryKey: ["admin", "products", "overview"],
    queryFn: () => listProducts({ page: 1, size: SAMPLE_SIZE }),
  });

  const orderDocs = orders?.docs ?? [];
  const active = orderDocs.filter((order) => order.status !== "cancelled");
  const revenue = active.reduce((sum, order) => sum + order.total, 0);
  const averageOrder = active.length ? revenue / active.length : 0;

  const statusData = STATUS_ORDER.map((status) => ({
    status,
    count: orderDocs.filter((order) => order.status === status).length,
  }));

  const lowStock = (products?.docs ?? [])
    .filter((product) => product.stock <= LOW_STOCK_THRESHOLD)
    .sort((a, b) => a.stock - b.stock);

  return (
    <>
      <header className="mb-8">
        <h1 className="type-display-md">Overview</h1>
        <p className="type-caption mt-2 text-shade-50">
          Aggregated client-side from the latest {SAMPLE_SIZE} orders — the
          API has no dedicated analytics endpoint yet.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Revenue (sample)" value={formatPrice(revenue)} />
        <StatTile label="Orders (sample)" value={String(orderDocs.length)} />
        <StatTile label="Avg order value" value={formatPrice(averageOrder)} />
        <StatTile
          label="Products low on stock"
          value={String(lowStock.length)}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartCard title="Revenue by day">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueByDay(orderDocs)}>
              <CartesianGrid stroke="var(--color-hairline-light)" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12, fill: "var(--color-shade-50)" }}
                tickLine={false}
                axisLine={{ stroke: "var(--color-hairline-light)" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "var(--color-shade-50)" }}
                tickLine={false}
                axisLine={false}
                width={70}
                tickFormatter={(value: number) => formatPrice(value)}
              />
              <Tooltip
                formatter={(value) => formatPrice(Number(value))}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid var(--color-hairline-light)",
                  fontSize: 13,
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-ink)"
                strokeWidth={2}
                dot={{ r: 3, fill: "var(--color-aloe)", stroke: "var(--color-ink)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Orders by status">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData}>
              <CartesianGrid stroke="var(--color-hairline-light)" vertical={false} />
              <XAxis
                dataKey="status"
                tick={{ fontSize: 12, fill: "var(--color-shade-50)" }}
                tickLine={false}
                axisLine={{ stroke: "var(--color-hairline-light)" }}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12, fill: "var(--color-shade-50)" }}
                tickLine={false}
                axisLine={false}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid var(--color-hairline-light)",
                  fontSize: 13,
                }}
              />
              <Bar
                dataKey="count"
                fill="var(--color-aloe)"
                stroke="var(--color-ink)"
                strokeWidth={1}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="mt-6 rounded-lg border border-hairline-light bg-canvas-light p-5">
        <h2 className="type-heading-md mb-4">
          Low stock (≤ {LOW_STOCK_THRESHOLD})
        </h2>
        {lowStock.length === 0 ? (
          <p className="type-caption text-shade-50">
            Every product is comfortably stocked.
          </p>
        ) : (
          <ul className="divide-y divide-hairline-light">
            {lowStock.map((product) => (
              <li
                key={product.id}
                className="flex items-center justify-between py-3"
              >
                <Link
                  href={`/products/${product.slug}`}
                  className="type-caption text-ink hover:underline"
                >
                  {product.name}
                </Link>
                <span
                  className={`type-eyebrow rounded-full px-2.5 py-1 ${
                    product.stock === 0
                      ? "bg-shade-30 text-shade-60"
                      : "bg-pistachio text-ink"
                  }`}
                >
                  {product.stock} left
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
