"use client";

import { useId } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

/** text-input token: light bg, hairline border, rounded-md, 44px min height. */
export function TextField({
  label,
  type = "text",
  placeholder,
  autoComplete,
  error,
  registration,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  registration: UseFormRegisterReturn;
}) {
  const id = useId();

  return (
    <div>
      <label htmlFor={id} className="type-caption mb-1.5 block text-ink">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        className="type-body-md min-h-11 w-full rounded-md border border-hairline-light bg-canvas-light px-3 py-2.5 text-ink outline-none transition-colors placeholder:text-shade-40 focus:border-ink aria-invalid:border-shade-70"
        {...registration}
      />
      {error && <p className="type-micro mt-1.5 text-shade-70">{error}</p>}
    </div>
  );
}
