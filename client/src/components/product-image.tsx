"use client";

import Image from "next/image";
import { useState } from "react";
import { PackageOpen } from "lucide-react";
import { useAssetUrl } from "@/lib/hooks/use-asset-url";

/**
 * product-image-frame: cream canvas, photography as content.
 * Images are stored as S3 keys and resolved through GET /public/<key>;
 * a quiet in-frame placeholder covers missing keys and load failures.
 */
export function ProductImage({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  const { url, isResolving } = useAssetUrl(src);

  if (isResolving) {
    return <div className="h-full w-full animate-pulse bg-canvas-cream" />;
  }

  if (!url || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-canvas-cream">
        <PackageOpen strokeWidth={1} className="h-10 w-10 text-shade-40" />
      </div>
    );
  }

  return (
    <Image
      src={url}
      alt={alt}
      fill
      sizes="(max-width: 768px) 50vw, 25vw"
      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
      onError={() => setFailed(true)}
    />
  );
}
