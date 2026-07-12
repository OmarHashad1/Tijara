"use client";

import Image from "next/image";
import { useState } from "react";
import { PackageOpen } from "lucide-react";

/**
 * product-image-frame: cream canvas, photography as content.
 * Seed data ships placeholder hosts, so a quiet in-frame fallback is part of
 * the design rather than a broken-image glyph.
 */
export function ProductImage({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-canvas-cream">
        <PackageOpen strokeWidth={1} className="h-10 w-10 text-shade-40" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 50vw, 25vw"
      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
      onError={() => setFailed(true)}
    />
  );
}
