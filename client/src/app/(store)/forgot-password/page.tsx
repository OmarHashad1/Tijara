"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { sendForgotPasswordOtp } from "@/lib/api/auth";
import { apiErrorMessage } from "@/lib/api/client";
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "@/lib/auth-schemas";
import { AuthCard } from "@/components/auth-card";
import { GuestOnly } from "@/components/guest-only";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const sendOtpMutation = useMutation({
    mutationFn: (values: ForgotPasswordValues) =>
      sendForgotPasswordOtp(values.email),
    onSuccess: (_result, values) => {
      toast.success("If that email exists, a reset code is on its way.");
      router.push(`/reset-password?email=${encodeURIComponent(values.email)}`);
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  return (
    <GuestOnly>
    <AuthCard
      eyebrow="Happens to everyone"
      title="Forgot your password?"
      subtitle="Enter your email and we'll send a 6-digit reset code."
    >
      <form
        onSubmit={handleSubmit((values) => sendOtpMutation.mutate(values))}
        className="space-y-5"
      >
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          registration={register("email")}
        />
        <SubmitButton pending={sendOtpMutation.isPending}>
          Send reset code
        </SubmitButton>
      </form>
    </AuthCard>
    </GuestOnly>
  );
}
