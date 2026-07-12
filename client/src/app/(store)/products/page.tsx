"use client";

import { Suspense } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { listProducts } from "@/lib/api/catalog";
import { ProductCard } from "@/components/product-card";
import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { CatalogPagination } from "@/components/catalog/catalog-pagination";
import { useCatalogFilters } from "@/components/catalog/use-catalog-filters";

function CatalogView() {
  const { filters, setFilter, clearFilters, hasActiveFilters } =
    useCatalogFilters();

  const { data, isPending, isError, isPlaceholderData } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => listProducts(filters),
    placeholderData: keepPreviousData,
  });

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-12 md:py-16">
      <header className="mb-10">
        <p className="type-eyebrow mb-4 text-shade-50">The full shelf</p>
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h1 className="type-display-lg">All products</h1>
          {data?.meta.count !== undefined && (
            <p className="type-caption text-shade-50">
              {data.meta.count} item{data.meta.count === 1 ? "" : "s"}
            </p>
          )}
        </div>
      </header>

      <CatalogFilters
        filters={filters}
        setFilter={setFilter}
        clearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <div className="mt-10">
        {isError ? (
          <div className="rounded-lg bg-canvas-cream px-6 py-16 text-center">
            <p className="type-heading-md">The shelf is unreachable</p>
            <p className="type-body-md mt-2 text-shade-50">
              We couldn&apos;t load products — is the API running?
            </p>
          </div>
        ) : isPending ? (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-lg p-4">
                <div className="aspect-square rounded-md bg-canvas-cream" />
                <div className="mt-4 h-4 w-3/4 rounded bg-canvas-cream" />
                <div className="mt-2 h-4 w-1/3 rounded bg-canvas-cream" />
              </div>
            ))}
          </div>
        ) : data.docs.length === 0 ? (
          <div className="rounded-lg bg-canvas-cream px-6 py-16 text-center">
            <p className="type-heading-md">Nothing on this shelf</p>
            <p className="type-body-md mx-auto mt-2 max-w-sm text-shade-50">
              No products match those filters. Loosen them up or browse the
              whole collection.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="btn-pill btn-primary mt-8"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div
            className={`grid grid-cols-2 gap-6 transition-opacity md:grid-cols-3 lg:grid-cols-4 ${
              isPlaceholderData ? "opacity-60" : ""
            }`}
          >
            {data.docs.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {data && (
        <CatalogPagination
          meta={data.meta}
          currentPage={Number(filters.page ?? 1)}
          onPageChange={(page) => setFilter("page", page)}
        />
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense>
      <CatalogView />
    </Suspense>
  );
}
