"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { resetPassword, verifyForgotPasswordOtp } from "@/lib/api/auth";
import { apiErrorMessage } from "@/lib/api/client";
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from "@/lib/auth-schemas";
import { AuthCard } from "@/components/auth-card";
import { GuestOnly } from "@/components/guest-only";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";

function ResetPasswordForm() {
  const router = useRouter();
  const email = useSearchParams().get("email") ?? "";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  /** Backend flow is two calls: verify the OTP, then set the new password. */
  const resetMutation = useMutation({
    mutationFn: async (values: ResetPasswordValues) => {
      await verifyForgotPasswordOtp({ email, otp: values.otp });
      await resetPassword({ email, newPassword: values.newPassword });
    },
    onSuccess: () => {
      toast.success("Password reset — log in with your new password.");
      router.push("/login");
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  if (!email) {
    return (
      <p className="type-body-md text-shade-50">
        This page needs the email from the reset flow — start again from{" "}
        <a href="/forgot-password" className="text-ink underline">
          forgot password
        </a>
        .
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((values) => resetMutation.mutate(values))}
      className="space-y-5"
    >
      <TextField
        label="Reset code"
        autoComplete="one-time-code"
        placeholder="123456"
        error={errors.otp?.message}
        registration={register("otp")}
      />
      <TextField
        label="New password"
        type="password"
        autoComplete="new-password"
        placeholder="8+ chars, 1 uppercase, 1 number, 1 symbol"
        error={errors.newPassword?.message}
        registration={register("newPassword")}
      />
      <SubmitButton pending={resetMutation.isPending}>
        Reset password
      </SubmitButton>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <GuestOnly>
    <AuthCard
      eyebrow="Almost there"
      title="Set a new password"
      subtitle="Enter the 6-digit code we emailed you, then pick a new password."
    >
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </AuthCard>
    </GuestOnly>
  );
}
