"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { changePassword, deleteAccount, updateProfile } from "@/lib/api/account";
import { apiErrorMessage } from "@/lib/api/client";
import { useUser } from "@/lib/hooks/use-user";
import { TextField } from "@/components/form/text-field";
import { SubmitButton } from "@/components/form/submit-button";
import { Spinner } from "@/components/spinner";

const profileSchema = z.object({
  firstName: z.string().min(3, "At least 3 characters").max(16),
  lastName: z.string().min(3, "At least 3 characters").max(16),
  phoneNumber: z.string().optional(),
});

const passwordChangeSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "At least one uppercase letter")
      .regex(/[0-9]/, "At least one number")
      .regex(/[^A-Za-z0-9]/, "At least one symbol"),
  })
  .refine((values) => values.oldPassword !== values.newPassword, {
    message: "New password must differ from the current one",
    path: ["newPassword"],
  });

type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordChangeSchema>;

function ProfileSection() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileValues>({ resolver: zodResolver(profileSchema) });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber ?? "",
      });
    }
  }, [user, reset]);

  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Profile updated.");
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  return (
    <section>
      <h2 className="type-heading-md mb-5">Profile</h2>
      <form
        onSubmit={handleSubmit((values) => profileMutation.mutate(values))}
        className="space-y-5"
      >
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="First name"
            error={errors.firstName?.message}
            registration={register("firstName")}
          />
          <TextField
            label="Last name"
            error={errors.lastName?.message}
            registration={register("lastName")}
          />
        </div>
        <TextField
          label="Phone number"
          type="tel"
          error={errors.phoneNumber?.message}
          registration={register("phoneNumber")}
        />
        <p className="type-caption text-shade-50">
          Signed in as {user?.email}
        </p>
        <SubmitButton pending={profileMutation.isPending}>
          Save changes
        </SubmitButton>
      </form>
    </section>
  );
}

function PasswordSection() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordValues>({ resolver: zodResolver(passwordChangeSchema) });

  const passwordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      reset();
      toast.success("Password changed.");
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  return (
    <section className="mt-14 border-t border-hairline-light pt-10">
      <h2 className="type-heading-md mb-5">Change password</h2>
      <form
        onSubmit={handleSubmit((values) => passwordMutation.mutate(values))}
        className="space-y-5"
      >
        <TextField
          label="Current password"
          type="password"
          autoComplete="current-password"
          error={errors.oldPassword?.message}
          registration={register("oldPassword")}
        />
        <TextField
          label="New password"
          type="password"
          autoComplete="new-password"
          error={errors.newPassword?.message}
          registration={register("newPassword")}
        />
        <SubmitButton pending={passwordMutation.isPending}>
          Change password
        </SubmitButton>
      </form>
    </section>
  );
}

function DangerSection() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.clear();
      toast.success("Account deleted. Goodbye 👋");
      router.push("/");
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  function confirmDelete() {
    // Native confirm keeps the destructive path deliberate without a modal system.
    if (window.confirm("Delete your account? This cannot be undone.")) {
      deleteMutation.mutate();
    }
  }

  return (
    <section className="mt-14 rounded-lg bg-canvas-cream p-6">
      <h2 className="type-heading-md">Delete account</h2>
      <p className="type-caption mt-2 text-shade-50">
        Removes your profile, cart and wishlist. Order history is retained for
        bookkeeping.
      </p>
      <button
        type="button"
        disabled={deleteMutation.isPending}
        onClick={confirmDelete}
        className="btn-pill btn-outline-on-light mt-5"
      >
        {deleteMutation.isPending ? <Spinner /> : "Delete my account"}
      </button>
    </section>
  );
}

export default function AccountPage() {
  return (
    <>
      <ProfileSection />
      <PasswordSection />
      <DangerSection />
    </>
  );
}
