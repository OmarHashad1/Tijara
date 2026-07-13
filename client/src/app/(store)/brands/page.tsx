"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { listBrands } from "@/lib/api/catalog";
import { Reveal } from "@/components/reveal";
import { BrandLogo } from "@/components/brand-logo";

export default function BrandsPage() {
  const { data: brands, isPending } = useQuery({
    queryKey: ["brands"],
    queryFn: listBrands,
  });

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-12 md:py-16">
      <header className="mb-12">
        <p className="type-eyebrow mb-4 text-shade-50">The label wall</p>
        <h1 className="type-display-lg">Brands</h1>
        <p className="type-body-md mt-4 max-w-md text-shade-50">
          Every label on the shelf earned its spot. Browse by the names you
          trust.
        </p>
      </header>

      {isPending ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-36 animate-pulse rounded-lg bg-canvas-cream" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(brands ?? []).map((brand, i) => (
            <Reveal key={brand._id} delay={Math.min(i * 0.05, 0.3)}>
              <Link
                href={`/brands/${brand.slug}`}
                className="group flex h-full flex-col justify-between rounded-lg border border-hairline-light bg-canvas-light p-7 transition-all duration-200 hover:border-ink hover:shadow-card-hover"
              >
                <div>
                  <div className="mb-5 flex items-center gap-4">
                    <BrandLogo logo={brand.logo} name={brand.name} />
                    <h2 className="type-heading-lg">{brand.name}</h2>
                  </div>
                  {brand.description && (
                    <p className="type-caption line-clamp-2 text-shade-50">
                      {brand.description}
                    </p>
                  )}
                </div>
                <span className="type-caption mt-6 text-shade-50 transition-colors group-hover:text-ink">
                  Shop {brand.name} →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
