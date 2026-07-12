"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import {
  addAddress,
  deleteAddress,
  listAddresses,
  updateAddress,
} from "@/lib/api/account";
import { apiErrorMessage } from "@/lib/api/client";
import { useUser } from "@/lib/hooks/use-user";
import { TextField } from "@/components/form/text-field";
import { SubmitButton } from "@/components/form/submit-button";

const addressSchema = z.object({
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  isDefault: z.boolean().optional(),
});

type AddressValues = z.infer<typeof addressSchema>;

export default function AddressesPage() {
  const { isLoggedIn } = useUser();
  const queryClient = useQueryClient();

  const { data: addresses, isPending } = useQuery({
    queryKey: ["addresses"],
    queryFn: listAddresses,
    enabled: isLoggedIn,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressValues>({ resolver: zodResolver(addressSchema) });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["addresses"] });
  }

  const addMutation = useMutation({
    mutationFn: addAddress,
    onSuccess: () => {
      invalidate();
      reset();
      toast.success("Address added.");
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  const defaultMutation = useMutation({
    mutationFn: (addressId: string) =>
      updateAddress({ addressId, isDefault: true }),
    onSuccess: () => {
      invalidate();
      toast.success("Default address updated.");
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      invalidate();
      toast.success("Address removed.");
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  return (
    <>
      <section>
        <h2 className="type-heading-md mb-5">Saved addresses</h2>
        {isPending ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-lg bg-canvas-cream" />
            ))}
          </div>
        ) : !addresses?.length ? (
          <p className="type-body-md text-shade-50">
            No addresses yet — add your first one below.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {addresses.map((address) => (
              <div
                key={address._id}
                className="rounded-lg border border-hairline-light p-4"
              >
                <p className="type-body-strong">{address.city}</p>
                <p className="type-caption text-shade-50">{address.country}</p>
                <div className="mt-3 flex items-center gap-4">
                  {address.isDefault ? (
                    <span className="type-eyebrow rounded-full bg-aloe px-2 py-0.5 text-ink">
                      Default
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={defaultMutation.isPending}
                      onClick={() => defaultMutation.mutate(address._id)}
                      className="type-caption text-shade-50 hover:text-ink hover:underline"
                    >
                      Make default
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={deleteMutation.isPending}
                    onClick={() => deleteMutation.mutate(address._id)}
                    className="type-caption text-shade-50 hover:text-ink hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-14 border-t border-hairline-light pt-10">
        <h2 className="type-heading-md mb-5">Add an address</h2>
        <form
          onSubmit={handleSubmit((values) => addMutation.mutate(values))}
          className="space-y-5"
        >
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="City"
              placeholder="Cairo"
              error={errors.city?.message}
              registration={register("city")}
            />
            <TextField
              label="Country"
              placeholder="Egypt"
              error={errors.country?.message}
              registration={register("country")}
            />
          </div>
          <label className="type-caption flex items-center gap-2 text-ink">
            <input
              type="checkbox"
              className="h-4 w-4 accent-black"
              {...register("isDefault")}
            />
            Set as default address
          </label>
          <SubmitButton pending={addMutation.isPending}>
            Add address
          </SubmitButton>
        </form>
      </section>
    </>
  );
}
