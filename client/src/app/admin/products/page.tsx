"use client";

import { useRef, useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  adminAdjustStock,
  adminCreateProduct,
  adminDeleteProduct,
  adminUpdateProduct,
  type ProductInput,
} from "@/lib/api/admin";
import { listBrands, listProducts } from "@/lib/api/catalog";
import { fetchAllCategories } from "@/lib/api/graphql";
import { apiErrorMessage } from "@/lib/api/client";
import type { Product } from "@/lib/api/types";
import { formatPrice } from "@/lib/format";
import { ProductImage } from "@/components/product-image";
import { CatalogPagination } from "@/components/catalog/catalog-pagination";
import { Spinner } from "@/components/spinner";

const EMPTY_FORM: ProductInput = {
  name: "",
  description: "",
  price: 0,
  discountPercent: 0,
  stock: 0,
  categoryId: "",
  brandId: "",
};

function StockAdjuster({ productId }: { productId: string }) {
  const queryClient = useQueryClient();
  const [delta, setDelta] = useState("");

  const stockMutation = useMutation({
    mutationFn: adminAdjustStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setDelta("");
      toast.success("Stock adjusted.");
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  function apply() {
    const quantity = Number(delta);
    if (!Number.isInteger(quantity) || quantity === 0) return;
    stockMutation.mutate({ productId, quantity });
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <input
        type="number"
        value={delta}
        onChange={(e) => setDelta(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") apply();
        }}
        placeholder="±"
        aria-label="Stock delta"
        className="type-caption w-16 rounded-md border border-hairline-light bg-canvas-light px-2 py-1.5 outline-none placeholder:text-shade-40 focus:border-ink"
      />
      <button
        type="button"
        disabled={stockMutation.isPending || !delta}
        onClick={apply}
        className="type-caption text-shade-50 underline-offset-2 hover:text-ink hover:underline disabled:opacity-40"
      >
        {stockMutation.isPending ? <Spinner className="h-3 w-3" /> : "Apply"}
      </button>
    </span>
  );
}

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [form, setForm] = useState<ProductInput>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);

  const { data, isPending } = useQuery({
    queryKey: ["products", "admin", page],
    queryFn: () => listProducts({ page, size: 10 }),
    placeholderData: keepPreviousData,
  });
  const { data: categories } = useQuery({
    queryKey: ["categories", "all"],
    queryFn: fetchAllCategories,
  });
  const { data: brands } = useQuery({ queryKey: ["brands"], queryFn: listBrands });

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    if (imagesInputRef.current) imagesInputRef.current.value = "";
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      const images = Array.from(imagesInputRef.current?.files ?? []);
      if (editingId) {
        const fields = { ...form };
        delete fields.stock;
        await adminUpdateProduct({ productId: editingId, fields, images });
      } else {
        await adminCreateProduct({ fields: form, images });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(editingId ? "Product updated." : "Product created.");
      resetForm();
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: adminDeleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted.");
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  function startEditing(product: Product) {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description ?? "",
      price: product.price,
      discountPercent: product.discountPercent ?? 0,
      stock: product.stock,
      categoryId: product.categoryId,
      brandId: product.brandId,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const inputClass =
    "type-caption min-h-10 rounded-md border border-hairline-light bg-canvas-light px-3 outline-none placeholder:text-shade-40 focus:border-ink";

  return (
    <>
      <header className="mb-8">
        <h1 className="type-display-md">Products</h1>
      </header>

      {/* Create / edit */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveMutation.mutate();
        }}
        className="mb-8 space-y-4 rounded-lg border border-hairline-light bg-canvas-light p-4"
      >
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <label className="grid gap-1">
            <span className="type-eyebrow text-shade-50">Name</span>
            <input
              required
              minLength={2}
              maxLength={128}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
          </label>
          <label className="grid gap-1">
            <span className="type-eyebrow text-shade-50">Price ($)</span>
            <input
              required
              type="number"
              min={0}
              step="0.01"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) })
              }
              className={inputClass}
            />
          </label>
          <label className="grid gap-1">
            <span className="type-eyebrow text-shade-50">Discount %</span>
            <input
              type="number"
              min={0}
              max={100}
              value={form.discountPercent}
              onChange={(e) =>
                setForm({ ...form, discountPercent: Number(e.target.value) })
              }
              className={inputClass}
            />
          </label>
          {!editingId && (
            <label className="grid gap-1">
              <span className="type-eyebrow text-shade-50">Initial stock</span>
              <input
                type="number"
                min={0}
                value={form.stock}
                onChange={(e) =>
                  setForm({ ...form, stock: Number(e.target.value) })
                }
                className={inputClass}
              />
            </label>
          )}
          <label className="grid gap-1">
            <span className="type-eyebrow text-shade-50">Category</span>
            <select
              required
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className={inputClass}
            >
              <option value="">Select…</option>
              {(categories ?? []).map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1">
            <span className="type-eyebrow text-shade-50">Brand</span>
            <select
              required
              value={form.brandId}
              onChange={(e) => setForm({ ...form, brandId: e.target.value })}
              className={inputClass}
            >
              <option value="">Select…</option>
              {(brands ?? []).map((brand) => (
                <option key={brand._id} value={brand._id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 sm:col-span-2">
            <span className="type-eyebrow text-shade-50">Description</span>
            <input
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              maxLength={2048}
              className={inputClass}
            />
          </label>
          <label className="grid gap-1 sm:col-span-2">
            <span className="type-eyebrow text-shade-50">
              Images (≤ 10 · png/jpeg/webp · 5MB each)
            </span>
            <input
              ref={imagesInputRef}
              type="file"
              multiple
              accept="image/png,image/jpeg,image/webp"
              className="type-caption"
            />
          </label>
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
              "Create product"
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

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-hairline-light bg-canvas-light">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-hairline-light">
              {["Product", "Price", "Stock", "Adjust", "Actions"].map(
                (heading) => (
                  <th key={heading} className="type-eyebrow px-4 py-3 text-shade-50">
                    {heading}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline-light">
            {isPending
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-4 py-4">
                      <div className="h-8 animate-pulse rounded bg-canvas-cream" />
                    </td>
                  </tr>
                ))
              : data?.docs.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md bg-canvas-cream">
                          <ProductImage
                            src={product.images[0]}
                            alt={product.name}
                          />
                        </div>
                        <p className="type-caption text-ink">{product.name}</p>
                      </div>
                    </td>
                    <td className="type-caption px-4 py-3">
                      {formatPrice(product.price)}
                      {Boolean(product.discountPercent) && (
                        <span className="type-micro ml-1 text-shade-50">
                          (−{product.discountPercent}%)
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`type-eyebrow rounded-full px-2.5 py-1 ${
                          product.stock === 0
                            ? "bg-shade-30 text-shade-60"
                            : product.stock <= 5
                              ? "bg-pistachio text-ink"
                              : "bg-aloe text-ink"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StockAdjuster productId={product._id} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => startEditing(product)}
                          className="type-caption text-shade-50 underline-offset-2 hover:text-ink hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled={deleteMutation.isPending}
                          onClick={() => deleteMutation.mutate(product._id)}
                          className="type-caption text-shade-50 underline-offset-2 hover:text-ink hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

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
