"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { fetchCategories } from "@/lib/api/graphql";
import { listBrands } from "@/lib/api/catalog";
import type { ListProductsParams } from "@/lib/api/types";

const SEARCH_DEBOUNCE_MS = 400;

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`type-eyebrow rounded-full px-3.5 py-2 transition-colors ${
        active ? "bg-aloe text-ink" : "bg-shade-30 text-ink hover:bg-aloe/60"
      }`}
    >
      {label}
    </button>
  );
}

function PriceInput({
  label,
  defaultValue,
  onCommit,
}: {
  label: string;
  defaultValue?: number;
  onCommit: (value: string) => void;
}) {
  return (
    <input
      type="number"
      min={0}
      placeholder={label}
      aria-label={label}
      defaultValue={defaultValue}
      onBlur={(e) => onCommit(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onCommit(e.currentTarget.value);
      }}
      className="type-caption w-24 rounded-md border border-hairline-light bg-canvas-light px-3 py-2 text-ink outline-none placeholder:text-shade-40 focus:border-ink"
    />
  );
}

export function CatalogFilters({
  filters,
  setFilter,
  clearFilters,
  hasActiveFilters,
}: {
  filters: ListProductsParams;
  setFilter: (
    key: keyof ListProductsParams,
    value: string | number | undefined,
  ) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}) {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
  const { data: brands } = useQuery({ queryKey: ["brands"], queryFn: listBrands });

  const [searchDraft, setSearchDraft] = useState(filters.search ?? "");

  /* Debounce typing into the URL (which drives the query). */
  useEffect(() => {
    const handle = setTimeout(() => {
      if ((filters.search ?? "") !== searchDraft) {
        setFilter("search", searchDraft || undefined);
      }
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDraft]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative">
          <Search
            strokeWidth={1.5}
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-shade-40"
          />
          <input
            type="search"
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            placeholder="Search the shelf…"
            className="type-body-md min-h-11 w-64 rounded-md border border-hairline-light bg-canvas-light py-2 pl-9 pr-3 text-ink outline-none placeholder:text-shade-40 focus:border-ink"
          />
        </div>

        <div className="flex items-center gap-2">
          <PriceInput
            label="Min $"
            defaultValue={filters.minPrice}
            onCommit={(v) => setFilter("minPrice", v || undefined)}
          />
          <span className="type-caption text-shade-40">—</span>
          <PriceInput
            label="Max $"
            defaultValue={filters.maxPrice}
            onCommit={(v) => setFilter("maxPrice", v || undefined)}
          />
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="type-caption text-shade-50 underline underline-offset-2 hover:text-ink"
          >
            Clear all
          </button>
        )}
      </div>

      {Boolean(categories?.length) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="type-eyebrow mr-1 text-shade-50">Category</span>
          {categories!.map((category) => (
            <FilterChip
              key={category.id}
              label={category.name}
              active={filters.categoryId === category.id}
              onClick={() =>
                setFilter(
                  "categoryId",
                  filters.categoryId === category.id ? undefined : category.id,
                )
              }
            />
          ))}
        </div>
      )}

      {Boolean(brands?.length) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="type-eyebrow mr-1 text-shade-50">Brand</span>
          {brands!.map((brand) => (
            <FilterChip
              key={brand._id}
              label={brand.name}
              active={filters.brandId === brand._id}
              onClick={() =>
                setFilter(
                  "brandId",
                  filters.brandId === brand._id ? undefined : brand._id,
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
