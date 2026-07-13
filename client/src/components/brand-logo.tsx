"use client";

import Image from "next/image";
import { useState } from "react";
import { useAssetUrl } from "@/lib/hooks/use-asset-url";

/**
 * Brand logo in a cream frame; falls back to a typeset monogram when the
 * brand has no logo (or it fails to load) — placeholder as design, not error.
 */
export function BrandLogo({
  logo,
  name,
  className = "h-14 w-14",
}: {
  logo?: string | null;
  name: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const { url, isResolving } = useAssetUrl(logo);

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-canvas-cream ${className}`}
    >
      {isResolving ? (
        <div className="h-full w-full animate-pulse bg-canvas-cream" />
      ) : !url || failed ? (
        <span
          aria-hidden
          className="font-display text-xl font-medium text-shade-40"
        >
          {name.charAt(0).toUpperCase()}
        </span>
      ) : (
        <Image
          src={url}
          alt={`${name} logo`}
          fill
          sizes="112px"
          className="object-contain p-2"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
