"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/api/graphql";
import { Reveal } from "@/components/reveal";

/**
 * Editorial category index: numbered tiles in the thin display cut, cream at
 * rest, aloe on hover. Categories arrive via GraphQL — the one resource that
 * lives off the REST API.
 */
export function CategoryBand() {
  const { data: categories, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  if (isError) return null;

  return (
    <section className="bg-canvas-cream px-6 py-20 md:py-28">
      <div className="mx-auto max-w-[1600px]">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4 md:mb-14">
            <div>
              <p className="type-eyebrow mb-4 text-shade-50">
                Every aisle, one shelf
              </p>
              <h2 className="type-display-md">Shop by category</h2>
            </div>
            <p className="type-body-md max-w-sm text-shade-50">
              Each category is kept deliberately small, so everything in it
              earns its place.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(categories ?? []).map((category, i) => (
            <Reveal key={category.id} delay={Math.min(i * 0.06, 0.3)}>
              <Link
                href={`/products?categoryId=${category.id}`}
                className="group flex items-center justify-between rounded-lg bg-canvas-light px-7 py-8 transition-colors duration-200 hover:bg-aloe"
              >
                <div className="flex items-baseline gap-5">
                  <span className="type-display-md text-shade-30 transition-colors duration-200 group-hover:text-ink/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="type-heading-lg text-ink">
                    {category.name}
                  </span>
                </div>
                <span
                  aria-hidden
                  className="type-heading-lg -translate-x-2 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                >
                  →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
