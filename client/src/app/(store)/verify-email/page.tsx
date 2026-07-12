"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { checkVerifyEmailOtp, sendVerifyEmailOtp } from "@/lib/api/auth";
import { apiErrorMessage } from "@/lib/api/client";
import { otpSchema, type OtpValues } from "@/lib/auth-schemas";
import { AuthCard } from "@/components/auth-card";
import { Spinner } from "@/components/spinner";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";

export default function VerifyEmailPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpValues>({ resolver: zodResolver(otpSchema) });

  const sendOtpMutation = useMutation({
    mutationFn: sendVerifyEmailOtp,
    onSuccess: () => toast.success("Code sent — check your inbox."),
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  const verifyMutation = useMutation({
    mutationFn: (values: OtpValues) => checkVerifyEmailOtp(values.otp),
    onSuccess: () => {
      toast.success("Email verified — you're all set!");
      router.push("/");
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  return (
    <AuthCard
      eyebrow="One last step"
      title="Verify your email"
      subtitle="We'll send a 6-digit code to the email on your account."
    >
      <button
        type="button"
        onClick={() => sendOtpMutation.mutate()}
        disabled={sendOtpMutation.isPending}
        className="btn-pill btn-outline-on-light w-full"
      >
        {sendOtpMutation.isPending ? <Spinner /> : "Send verification code"}
      </button>

      <form
        onSubmit={handleSubmit((values) => verifyMutation.mutate(values))}
        className="mt-6 space-y-5"
      >
        <TextField
          label="Verification code"
          autoComplete="one-time-code"
          placeholder="123456"
          error={errors.otp?.message}
          registration={register("otp")}
        />
        <SubmitButton pending={verifyMutation.isPending}>
          Verify email
        </SubmitButton>
      </form>
    </AuthCard>
  );
}
