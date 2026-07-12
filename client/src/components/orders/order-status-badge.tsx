import type { OrderStatus } from "@/lib/api/types";

/** No alarm red in the system — statuses stay in greens + the shade ladder. */
const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-shade-30 text-ink",
  confirmed: "bg-pistachio text-ink",
  shipped: "bg-aloe text-ink",
  delivered: "bg-aloe text-ink",
  cancelled: "bg-shade-30 text-shade-60",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`type-eyebrow rounded-full px-2.5 py-1 ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
