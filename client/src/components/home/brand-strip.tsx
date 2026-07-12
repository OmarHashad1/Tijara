"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { listBrands } from "@/lib/api/catalog";

/**
 * Brand shelf as an infinite wordmark marquee — the guide's uniform-height
 * logo strip, set in type because seed-data logos are placeholder URLs.
 * The track renders twice and translates -50% for a seamless loop.
 */
export function BrandStrip() {
  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: listBrands,
  });

  if (!brands?.length) return null;

  const track = [...brands, ...brands];

  return (
    <section className="overflow-hidden border-y border-hairline-light bg-canvas-light py-12">
      <p className="type-eyebrow mb-8 text-center text-shade-50">
        The brand shelf
      </p>
      <div className="flex w-max animate-marquee items-center gap-16 pr-16 hover:[animation-play-state:paused] motion-reduce:animate-none">
        {track.map((brand, i) => (
          <Link
            key={`${brand._id}-${i}`}
            href={`/brands/${brand.slug}`}
            className="type-heading-lg shrink-0 text-shade-40 transition-colors hover:text-ink"
          >
            {brand.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
