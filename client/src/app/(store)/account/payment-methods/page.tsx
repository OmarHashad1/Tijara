"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreditCard, Banknote } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import {
  addPaymentMethod,
  deletePaymentMethod,
  listPaymentMethods,
} from "@/lib/api/account";
import { apiErrorMessage } from "@/lib/api/client";
import { useUser } from "@/lib/hooks/use-user";
import { TextField } from "@/components/form/text-field";
import { SubmitButton } from "@/components/form/submit-button";

const paymentMethodSchema = z.object({
  method: z.enum(["card", "POD"]),
  last4: z.coerce
    .number<number>()
    .int()
    .min(1000, "Enter the last 4 digits")
    .max(9999, "Enter the last 4 digits"),
  isDefault: z.boolean().optional(),
});

type PaymentMethodValues = z.infer<typeof paymentMethodSchema>;

export default function PaymentMethodsPage() {
  const { isLoggedIn } = useUser();
  const queryClient = useQueryClient();

  const { data: paymentMethods, isPending } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: listPaymentMethods,
    enabled: isLoggedIn,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentMethodValues>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: { method: "card" },
  });

  const addMutation = useMutation({
    mutationFn: addPaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      reset({ method: "card" });
      toast.success("Payment method saved.");
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      toast.success("Payment method removed.");
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  return (
    <>
      <section>
        <h2 className="type-heading-md mb-5">Saved payment methods</h2>
        {isPending ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-lg bg-canvas-cream" />
            ))}
          </div>
        ) : !paymentMethods?.length ? (
          <p className="type-body-md text-shade-50">
            Nothing saved yet — add a method below.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {paymentMethods.map((paymentMethod) => (
              <div
                key={paymentMethod._id}
                className="flex items-center justify-between rounded-lg border border-hairline-light p-4"
              >
                <div className="flex items-center gap-3">
                  {paymentMethod.method === "card" ? (
                    <CreditCard strokeWidth={1.5} className="h-5 w-5" />
                  ) : (
                    <Banknote strokeWidth={1.5} className="h-5 w-5" />
                  )}
                  <div>
                    <p className="type-body-strong">
                      {paymentMethod.method === "card"
                        ? `Card •••• ${paymentMethod.last4}`
                        : "Pay on delivery"}
                    </p>
                    {paymentMethod.isDefault && (
                      <span className="type-eyebrow text-shade-50">
                        Default
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate(paymentMethod._id)}
                  className="type-caption text-shade-50 hover:text-ink hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-14 border-t border-hairline-light pt-10">
        <h2 className="type-heading-md mb-5">Add a payment method</h2>
        <form
          onSubmit={handleSubmit((values) => addMutation.mutate(values))}
          className="space-y-5"
        >
          <div>
            <label className="type-caption mb-1.5 block text-ink">Type</label>
            <select
              {...register("method")}
              className="type-body-md min-h-11 w-full rounded-md border border-hairline-light bg-canvas-light px-3 py-2.5 text-ink outline-none focus:border-ink"
            >
              <option value="card">Card</option>
              <option value="POD">Pay on delivery</option>
            </select>
          </div>
          <TextField
            label="Last 4 digits"
            type="number"
            placeholder="4242"
            error={errors.last4?.message}
            registration={register("last4")}
          />
          <label className="type-caption flex items-center gap-2 text-ink">
            <input
              type="checkbox"
              className="h-4 w-4 accent-black"
              {...register("isDefault")}
            />
            Set as default
          </label>
          <SubmitButton pending={addMutation.isPending}>
            Save payment method
          </SubmitButton>
        </form>
      </section>
    </>
  );
}
