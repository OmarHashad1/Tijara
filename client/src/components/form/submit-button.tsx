"use client";

import { Spinner } from "@/components/spinner";

/** Full-width primary pill with a built-in pending spinner. */
export function SubmitButton({
  pending,
  children,
}: {
  pending: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-pill btn-primary w-full"
    >
      {pending ? <Spinner /> : children}
    </button>
  );
}
