"use client";

import { useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { adminDeleteReview, adminListReviews } from "@/lib/api/admin";
import { apiErrorMessage } from "@/lib/api/client";
import { CatalogPagination } from "@/components/catalog/catalog-pagination";

export default function AdminReviewsPage() {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState<number | "all">("all");
  const [page, setPage] = useState(1);

  const { data, isPending } = useQuery({
    queryKey: ["admin", "reviews", rating, page],
    queryFn: () =>
      adminListReviews({
        rating: rating === "all" ? undefined : rating,
        page,
        size: 15,
      }),
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: adminDeleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
      toast.success("Review deleted.");
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  return (
    <>
      <header className="mb-8">
        <h1 className="type-display-md">Reviews</h1>
      </header>

      <div className="mb-6 flex flex-wrap gap-2">
        {(["all", 1, 2, 3, 4, 5] as const).map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => {
              setRating(filter);
              setPage(1);
            }}
            className={`type-eyebrow rounded-full px-3.5 py-2 transition-colors ${
              rating === filter
                ? "bg-aloe text-ink"
                : "bg-shade-30 text-ink hover:bg-aloe/60"
            }`}
          >
            {filter === "all" ? "all" : `${filter}★`}
          </button>
        ))}
      </div>

      {isPending ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-canvas-light" />
          ))}
        </div>
      ) : !data || data.docs.length === 0 ? (
        <p className="type-caption rounded-lg border border-hairline-light bg-canvas-light px-4 py-8 text-center text-shade-50">
          No reviews match this filter.
        </p>
      ) : (
        <ul className="space-y-3">
          {data.docs.map((review) => (
            <li
              key={review._id}
              className="rounded-lg border border-hairline-light bg-canvas-light p-4"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex gap-0.5" aria-label={`${review.rating} stars`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        strokeWidth={1.5}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "fill-ink text-ink"
                            : "text-shade-30"
                        }`}
                      />
                    ))}
                  </span>
                  <span className="type-micro text-shade-50">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <button
                  type="button"
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate(review._id)}
                  className="type-caption text-shade-50 underline-offset-2 hover:text-ink hover:underline"
                >
                  Delete
                </button>
              </div>
              {review.comment && (
                <p className="type-caption mt-2 text-ink">{review.comment}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      {data && (
        <CatalogPagination
          meta={data.meta}
          currentPage={page}
          onPageChange={setPage}
        />
      )}
    </>
  );
}
