"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { listProductReviews } from "@/lib/api/catalog";
import type { Review } from "@/lib/api/types";
import { CatalogPagination } from "@/components/catalog/catalog-pagination";

const REVIEWS_PAGE_SIZE = 5;

function Stars({ rating }: { rating: number }) {
  return (
    <div
      className="flex gap-0.5"
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          strokeWidth={1.5}
          className={`h-4 w-4 ${
            i < rating ? "fill-ink text-ink" : "text-shade-30"
          }`}
        />
      ))}
    </div>
  );
}

function reviewerName(review: Review): string {
  if (typeof review.userId === "object" && review.userId?.firstName) {
    return `${review.userId.firstName} ${review.userId.lastName ?? ""}`.trim();
  }
  return "Verified buyer";
}

export function ProductReviews({ productId }: { productId: string }) {
  const [page, setPage] = useState(1);
  const { data, isPending } = useQuery({
    queryKey: ["reviews", productId, page],
    queryFn: () =>
      listProductReviews(productId, { page, size: REVIEWS_PAGE_SIZE }),
    placeholderData: keepPreviousData,
  });

  return (
    <section className="mt-20 border-t border-hairline-light pt-12">
      <h2 className="type-heading-xl mb-8">Reviews</h2>

      {isPending ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-canvas-cream" />
          ))}
        </div>
      ) : !data || data.docs.length === 0 ? (
        <div className="rounded-lg bg-canvas-cream px-6 py-12 text-center">
          <p className="type-body-md text-shade-50">
            No reviews yet. Reviews can be left from your order history after
            a purchase arrives.
          </p>
        </div>
      ) : (
        <>
          <ul className="space-y-8">
            {data.docs.map((review) => (
              <li key={review._id}>
                <div className="flex items-center gap-3">
                  <Stars rating={review.rating} />
                  <span className="type-caption text-shade-50">
                    {reviewerName(review)} ·{" "}
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                {review.comment && (
                  <p className="type-body-md mt-2 max-w-2xl text-ink">
                    {review.comment}
                  </p>
                )}
              </li>
            ))}
          </ul>

          <CatalogPagination
            meta={data.meta}
            currentPage={page}
            onPageChange={setPage}
          />
        </>
      )}
    </section>
  );
}
