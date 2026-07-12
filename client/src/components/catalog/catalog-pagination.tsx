"use client";

import type { PaginationMeta } from "@/lib/api/types";

export function CatalogPagination({
  meta,
  currentPage,
  onPageChange,
}: {
  meta: PaginationMeta;
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  const totalPages = meta.pages ?? 1;
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className="mt-14 flex items-center justify-center gap-6"
    >
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="btn-pill btn-outline-on-light px-5! py-2!"
      >
        ← Prev
      </button>
      <span className="type-caption text-shade-50">
        Page {currentPage} of {totalPages}
      </span>
      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="btn-pill btn-outline-on-light px-5! py-2!"
      >
        Next →
      </button>
    </nav>
  );
}
