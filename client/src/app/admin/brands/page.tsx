"use client";

import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  adminCreateBrand,
  adminDeleteBrand,
  adminUpdateBrand,
  type BrandInput,
} from "@/lib/api/admin";
import { listBrands } from "@/lib/api/catalog";
import { fetchAllCategories } from "@/lib/api/graphql";
import { apiErrorMessage } from "@/lib/api/client";
import type { Brand } from "@/lib/api/types";
import { BrandLogo } from "@/components/brand-logo";
import { Spinner } from "@/components/spinner";

const EMPTY_FORM: BrandInput = { name: "", description: "", categoryIds: [] };

export default function AdminBrandsPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<BrandInput>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const { data: brands, isPending } = useQuery({
    queryKey: ["brands"],
    queryFn: listBrands,
  });
  const { data: categories } = useQuery({
    queryKey: ["categories", "all"],
    queryFn: fetchAllCategories,
  });

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    if (logoInputRef.current) logoInputRef.current.value = "";
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      const logo = logoInputRef.current?.files?.[0];
      if (editingId) {
        await adminUpdateBrand({ brandId: editingId, fields: form, logo });
      } else {
        await adminCreateBrand({ fields: form, logo });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      toast.success(editingId ? "Brand updated." : "Brand created.");
      resetForm();
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: adminDeleteBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      toast.success("Brand deleted.");
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  function startEditing(brand: Brand) {
    setEditingId(brand._id);
    setForm({
      name: brand.name,
      description: brand.description ?? "",
      categoryIds: brand.categoryIds ?? [],
    });
  }

  function toggleCategory(categoryId: string) {
    setForm((current) => ({
      ...current,
      categoryIds: current.categoryIds.includes(categoryId)
        ? current.categoryIds.filter((id) => id !== categoryId)
        : [...current.categoryIds, categoryId],
    }));
  }

  const inputClass =
    "type-caption min-h-10 rounded-md border border-hairline-light bg-canvas-light px-3 outline-none placeholder:text-shade-40 focus:border-ink";

  return (
    <>
      <header className="mb-8">
        <h1 className="type-display-md">Brands</h1>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (form.categoryIds.length === 0) {
            toast.error("Pick at least one category.");
            return;
          }
          saveMutation.mutate();
        }}
        className="mb-8 space-y-4 rounded-lg border border-hairline-light bg-canvas-light p-4"
      >
        <div className="flex flex-wrap items-end gap-3">
          <label className="grid gap-1">
            <span className="type-eyebrow text-shade-50">Name</span>
            <input
              required
              minLength={2}
              maxLength={64}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Acme"
              className={`${inputClass} w-48`}
            />
          </label>
          <label className="grid flex-1 gap-1">
            <span className="type-eyebrow text-shade-50">Description</span>
            <input
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              maxLength={1024}
              placeholder="Optional"
              className={inputClass}
            />
          </label>
          <label className="grid gap-1">
            <span className="type-eyebrow text-shade-50">
              Logo (png/jpeg/webp ≤ 2MB)
            </span>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="type-caption"
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="type-eyebrow mr-1 text-shade-50">Categories</span>
          {(categories ?? []).map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => toggleCategory(category.id)}
              className={`type-eyebrow rounded-full px-3 py-1.5 transition-colors ${
                form.categoryIds.includes(category.id)
                  ? "bg-aloe text-ink"
                  : "bg-shade-30 text-ink hover:bg-aloe/60"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="btn-pill btn-primary px-5! py-2!"
          >
            {saveMutation.isPending ? (
              <Spinner />
            ) : editingId ? (
              "Save changes"
            ) : (
              "Create brand"
            )}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="type-caption text-shade-50 hover:text-ink hover:underline"
            >
              Cancel edit
            </button>
          )}
        </div>
      </form>

      {isPending ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-canvas-light" />
          ))}
        </div>
      ) : (
        <ul className="space-y-3">
          {(brands ?? []).map((brand) => (
            <li
              key={brand._id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-hairline-light bg-canvas-light px-5 py-4"
            >
              <div className="flex items-center gap-4">
                <BrandLogo logo={brand.logo} name={brand.name} />
                <div>
                  <p className="type-body-strong">{brand.name}</p>
                  {brand.description && (
                    <p className="type-micro max-w-md truncate text-shade-50">
                      {brand.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => startEditing(brand)}
                  className="type-caption text-shade-50 underline-offset-2 hover:text-ink hover:underline"
                >
                  Edit
                </button>
                <button
                  type="button"
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate(brand._id)}
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
