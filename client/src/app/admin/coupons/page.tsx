"use client";

import { useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  adminCreateCoupon,
  adminDeleteCoupon,
  adminListCoupons,
  adminUpdateCoupon,
  type CouponInput,
} from "@/lib/api/admin";
import { apiErrorMessage } from "@/lib/api/client";
import type { Coupon } from "@/lib/api/types";
import { formatPrice } from "@/lib/format";
import { CatalogPagination } from "@/components/catalog/catalog-pagination";
import { Spinner } from "@/components/spinner";

const EMPTY_FORM: CouponInput = {
  code: "",
  discountType: "percent",
  discountValue: 10,
  expiresAt: "",
  usageLimit: 100,
};

export default function AdminCouponsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [form, setForm] = useState<CouponInput>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data, isPending } = useQuery({
    queryKey: ["admin", "coupons", page],
    queryFn: () => adminListCoupons({ page, size: 15 }),
    placeholderData: keepPreviousData,
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin", "coupons"] });
  }

  const saveMutation = useMutation({
    mutationFn: async (input: CouponInput) => {
      const body = {
        ...input,
        expiresAt: new Date(input.expiresAt).toISOString(),
      };
      if (editingId) {
        await adminUpdateCoupon({ couponId: editingId, changes: body });
      } else {
        await adminCreateCoupon(body);
      }
    },
    onSuccess: () => {
      invalidate();
      setForm(EMPTY_FORM);
      setEditingId(null);
      toast.success(editingId ? "Coupon updated." : "Coupon created.");
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: adminDeleteCoupon,
    onSuccess: () => {
      invalidate();
      toast.success("Coupon deleted.");
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  function startEditing(coupon: Coupon) {
    setEditingId(coupon._id);
    setForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      expiresAt: coupon.expiresAt.slice(0, 10),
      usageLimit: coupon.usageLimit,
    });
  }

  const inputClass =
    "type-caption min-h-10 rounded-md border border-hairline-light bg-canvas-light px-3 outline-none placeholder:text-shade-40 focus:border-ink";

  return (
    <>
      <header className="mb-8">
        <h1 className="type-display-md">Coupons</h1>
      </header>

      {/* Create / edit */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveMutation.mutate(form);
        }}
        className="mb-8 flex flex-wrap items-end gap-3 rounded-lg border border-hairline-light bg-canvas-light p-4"
      >
        <label className="grid gap-1">
          <span className="type-eyebrow text-shade-50">Code</span>
          <input
            required
            value={form.code}
            onChange={(e) =>
              setForm({ ...form, code: e.target.value.toUpperCase() })
            }
            placeholder="SUMMER20"
            className={`${inputClass} w-36 uppercase`}
          />
        </label>
        <label className="grid gap-1">
          <span className="type-eyebrow text-shade-50">Type</span>
          <select
            value={form.discountType}
            onChange={(e) =>
              setForm({
                ...form,
                discountType: e.target.value as CouponInput["discountType"],
              })
            }
            className={`${inputClass} w-28`}
          >
            <option value="percent">percent</option>
            <option value="fixed">fixed</option>
          </select>
        </label>
        <label className="grid gap-1">
          <span className="type-eyebrow text-shade-50">Value</span>
          <input
            required
            type="number"
            min={0}
            value={form.discountValue}
            onChange={(e) =>
              setForm({ ...form, discountValue: Number(e.target.value) })
            }
            className={`${inputClass} w-24`}
          />
        </label>
        <label className="grid gap-1">
          <span className="type-eyebrow text-shade-50">Expires</span>
          <input
            required
            type="date"
            value={form.expiresAt}
            onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
            className={`${inputClass} w-40`}
          />
        </label>
        <label className="grid gap-1">
          <span className="type-eyebrow text-shade-50">Usage limit</span>
          <input
            required
            type="number"
            min={1}
            value={form.usageLimit}
            onChange={(e) =>
              setForm({ ...form, usageLimit: Number(e.target.value) })
            }
            className={`${inputClass} w-24`}
          />
        </label>
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
            "Create coupon"
          )}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm(EMPTY_FORM);
            }}
            className="type-caption text-shade-50 hover:text-ink hover:underline"
          >
            Cancel edit
          </button>
        )}
      </form>

      <div className="overflow-x-auto rounded-lg border border-hairline-light bg-canvas-light">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-hairline-light">
              {["Code", "Discount", "Expires", "Used", "Actions"].map(
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
              ? Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-4 py-4">
                      <div className="h-5 animate-pulse rounded bg-canvas-cream" />
                    </td>
                  </tr>
                ))
              : data?.docs.map((coupon) => {
                  const expired = new Date(coupon.expiresAt) < new Date();
                  return (
                    <tr key={coupon._id}>
                      <td className="type-caption px-4 py-3 font-medium">
                        {coupon.code}
                      </td>
                      <td className="type-caption px-4 py-3">
                        {coupon.discountType === "percent"
                          ? `${coupon.discountValue}%`
                          : formatPrice(coupon.discountValue)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`type-eyebrow rounded-full px-2.5 py-1 ${
                            expired
                              ? "bg-shade-30 text-shade-60"
                              : "bg-pistachio text-ink"
                          }`}
                        >
                          {new Date(coupon.expiresAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="type-caption px-4 py-3">
                        {coupon.timesUsed}/{coupon.usageLimit}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => startEditing(coupon)}
                            className="type-caption text-shade-50 underline-offset-2 hover:text-ink hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            disabled={deleteMutation.isPending}
                            onClick={() => deleteMutation.mutate(coupon._id)}
                            className="type-caption text-shade-50 underline-offset-2 hover:text-ink hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
        {data && data.docs.length === 0 && (
          <p className="type-caption px-4 py-8 text-center text-shade-50">
            No coupons yet — create the first one above.
          </p>
        )}
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
