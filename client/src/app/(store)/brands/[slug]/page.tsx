"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getBrand, listProducts } from "@/lib/api/catalog";
import { ProductCard } from "@/components/product-card";
import { CatalogPagination } from "@/components/catalog/catalog-pagination";

const PAGE_SIZE = 12;

export default function BrandPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState(1);

  const {
    data: brand,
    isPending: isBrandPending,
    isError,
  } = useQuery({
    queryKey: ["brand", slug],
    queryFn: () => getBrand(slug),
  });

  const { data: products, isPending: isProductsPending } = useQuery({
    queryKey: ["products", "brand", brand?._id, page],
    queryFn: () => listProducts({ brandId: brand!._id, page, size: PAGE_SIZE }),
    enabled: Boolean(brand?._id),
    placeholderData: keepPreviousData,
  });

  if (isError) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-lg bg-canvas-cream px-6 py-16 text-center">
          <p className="type-heading-md">Brand not found</p>
          <Link href="/brands" className="btn-pill btn-primary mt-8">
            All brands
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-12 md:py-16">
      <nav aria-label="Breadcrumb" className="type-caption mb-8 text-shade-50">
        <Link href="/brands" className="hover:text-ink hover:underline">
          Brands
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{brand?.name ?? "…"}</span>
      </nav>

      <header className="mb-12">
        {isBrandPending ? (
          <div className="h-12 w-64 animate-pulse rounded bg-canvas-cream" />
        ) : (
          <>
            <h1 className="type-display-lg">{brand.name}</h1>
            {brand.description && (
              <p className="type-body-md mt-4 max-w-xl text-shade-50">
                {brand.description}
              </p>
            )}
          </>
        )}
      </header>

      {isProductsPending ? (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg p-4">
              <div className="aspect-square rounded-md bg-canvas-cream" />
              <div className="mt-4 h-4 w-3/4 rounded bg-canvas-cream" />
            </div>
          ))}
        </div>
      ) : !products || products.docs.length === 0 ? (
        <div className="rounded-lg bg-canvas-cream px-6 py-16 text-center">
          <p className="type-heading-md">No products from this brand yet</p>
          <Link href="/products" className="btn-pill btn-primary mt-8">
            Browse everything
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.docs.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <CatalogPagination
            meta={products.meta}
            currentPage={page}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
