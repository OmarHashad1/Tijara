"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createCategory,
  deleteCategory,
  fetchAllCategories,
  updateCategory,
  type CategoryStatus,
} from "@/lib/api/graphql";
import { Spinner } from "@/components/spinner";

const STATUSES: CategoryStatus[] = ["DRAFT", "PUBLISHED", "SUSPENDED"];

/** Categories are the GraphQL-managed resource — all CRUD goes to /graphql. */
export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");

  const { data: categories, isPending } = useQuery({
    queryKey: ["categories", "all"],
    queryFn: fetchAllCategories,
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  }

  const createMutation = useMutation({
    mutationFn: () => createCategory({ name }),
    onSuccess: () => {
      invalidate();
      setName("");
      toast.success("Category created.");
    },
    onError: () => toast.error("Couldn't create the category."),
  });

  const statusMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      invalidate();
      toast.success("Category updated.");
    },
    onError: () => toast.error("Couldn't update the category."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      invalidate();
      toast.success("Category deleted.");
    },
    onError: () => toast.error("Couldn't delete the category."),
  });

  return (
    <>
      <header className="mb-8">
        <h1 className="type-display-md">Categories</h1>
        <p className="type-caption mt-2 text-shade-50">
          Managed via GraphQL — the one resource that lives off the REST API.
        </p>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim().length >= 2) createMutation.mutate();
        }}
        className="mb-8 flex items-end gap-3 rounded-lg border border-hairline-light bg-canvas-light p-4"
      >
        <label className="grid flex-1 gap-1">
          <span className="type-eyebrow text-shade-50">New category</span>
          <input
            required
            minLength={2}
            maxLength={64}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Kitchen"
            className="type-caption min-h-10 rounded-md border border-hairline-light bg-canvas-light px-3 outline-none placeholder:text-shade-40 focus:border-ink"
          />
        </label>
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="btn-pill btn-primary px-5! py-2!"
        >
          {createMutation.isPending ? <Spinner /> : "Create"}
        </button>
      </form>

      {isPending ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-canvas-light" />
          ))}
        </div>
      ) : (
        <ul className="space-y-3">
          {(categories ?? []).map((category) => (
            <li
              key={category.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-hairline-light bg-canvas-light px-5 py-4"
            >
              <div>
                <p className="type-body-strong">{category.name}</p>
                {category.slug && (
                  <p className="type-micro text-shade-50">/{category.slug}</p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <select
                  aria-label={`Status of ${category.name}`}
                  value={category.status ?? "PUBLISHED"}
                  disabled={statusMutation.isPending}
                  onChange={(e) =>
                    statusMutation.mutate({
                      id: category.id,
                      changes: { status: e.target.value as CategoryStatus },
                    })
                  }
                  className="type-caption rounded-md border border-hairline-light bg-canvas-light px-2 py-1.5 outline-none focus:border-ink"
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status.toLowerCase()}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate(category.id)}
                  className="type-caption text-shade-50 underline-offset-2 hover:text-ink hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
