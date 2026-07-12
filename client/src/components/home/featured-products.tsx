"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { listProducts } from "@/lib/api/catalog";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";

/** 7 products + the sale tile fill two 4-up rows. */
const FEATURED_COUNT = 7;

function SaleTile() {
  return (
    <Link
      href="/products"
      className="group flex flex-col justify-between rounded-lg bg-aloe p-6 transition-shadow duration-200 hover:shadow-card-hover"
    >
      <p className="type-eyebrow text-shade-60">Seasonal sale</p>
      <div>
        <p className="type-display-md text-ink">
          Up to
          <br />
          30% off
        </p>
        <p className="type-body-md mt-3 text-shade-60">
          Marked pieces across every category.
        </p>
      </div>
      <span className="btn-pill btn-primary mt-6 self-start px-5! py-2!">
        Shop the sale
        <span
          aria-hidden
          className="transition-transform duration-200 group-hover:translate-x-1"
        >
          →
        </span>
      </span>
    </Link>
  );
}

/** Merchandising layer opener: light canvas, sale tile + product-card grid. */
export function FeaturedProducts() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => listProducts({ page: 1, size: FEATURED_COUNT }),
  });

  return (
    <section className="bg-canvas-light px-6 py-20 md:py-28">
      <div className="mx-auto max-w-[1600px]">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-14">
            <div>
              <p className="type-eyebrow mb-4 inline-block rounded-full bg-shade-30 px-3 py-1 text-ink">
                New in
              </p>
              <h2 className="type-display-md">Fresh on the shelf</h2>
            </div>
            <Link
              href="/products"
              className="btn-pill btn-outline-on-light px-5! py-2!"
            >
              View all products
            </Link>
          </div>
        </Reveal>

        {isError ? (
          <div className="rounded-lg bg-canvas-cream px-6 py-16 text-center">
            <p className="type-heading-md">The shelf is unreachable</p>
            <p className="type-body-md mt-2 text-shade-50">
              We couldn&apos;t load products — is the API running?
            </p>
          </div>
        ) : isPending ? (
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {Array.from({ length: FEATURED_COUNT + 1 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-lg p-4">
                <div className="aspect-square rounded-md bg-canvas-cream" />
                <div className="mt-4 h-4 w-3/4 rounded bg-canvas-cream" />
                <div className="mt-2 h-4 w-1/3 rounded bg-canvas-cream" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            <Reveal>
              <SaleTile />
            </Reveal>
            {data.docs.map((product, i) => (
              <Reveal key={product.id} delay={Math.min((i + 1) * 0.07, 0.35)}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
