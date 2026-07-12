"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ListProductsParams } from "@/lib/api/types";

const PAGE_SIZE = 12;

/**
 * Catalog state lives in the URL so filtered views are shareable and the
 * category links on the homepage deep-link straight into a filtered grid.
 */
export function useCatalogFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters: ListProductsParams = {
    search: searchParams.get("search") ?? undefined,
    categoryId: searchParams.get("categoryId") ?? undefined,
    brandId: searchParams.get("brandId") ?? undefined,
    minPrice: numberParam(searchParams.get("minPrice")),
    maxPrice: numberParam(searchParams.get("maxPrice")),
    page: numberParam(searchParams.get("page")) ?? 1,
    size: PAGE_SIZE,
  };

  function setFilter(
    key: keyof ListProductsParams,
    value: string | number | undefined,
  ) {
    const next = new URLSearchParams(searchParams);
    if (value === undefined || value === "") {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }
    // Any filter change restarts pagination.
    if (key !== "page") next.delete("page");
    router.replace(`${pathname}?${next.toString()}`, { scroll: key === "page" });
  }

  function clearFilters() {
    router.replace(pathname, { scroll: false });
  }

  const hasActiveFilters = Boolean(
    filters.search ||
      filters.categoryId ||
      filters.brandId ||
      filters.minPrice !== undefined ||
      filters.maxPrice !== undefined,
  );

  return { filters, setFilter, clearFilters, hasActiveFilters };
}

function numberParam(raw: string | null): number | undefined {
  if (raw === null || raw === "") return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}
