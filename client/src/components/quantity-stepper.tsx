"use client";

import { Minus, Plus } from "lucide-react";

/** quantity-stepper token: −/qty/+ in a hairline rounded-md frame. */
export function QuantityStepper({
  quantity,
  maxQuantity,
  onChange,
  disabled = false,
}: {
  quantity: number;
  maxQuantity: number;
  onChange: (quantity: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="inline-flex items-center rounded-md border border-hairline-light bg-canvas-light">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={disabled || quantity <= 1}
        onClick={() => onChange(quantity - 1)}
        className="px-3 py-2 text-ink transition-opacity hover:opacity-60 disabled:opacity-30"
      >
        <Minus strokeWidth={1.5} className="h-3.5 w-3.5" />
      </button>
      <span className="type-caption min-w-8 text-center text-ink">
        {quantity}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={disabled || quantity >= maxQuantity}
        onClick={() => onChange(quantity + 1)}
        className="px-3 py-2 text-ink transition-opacity hover:opacity-60 disabled:opacity-30"
      >
        <Plus strokeWidth={1.5} className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
