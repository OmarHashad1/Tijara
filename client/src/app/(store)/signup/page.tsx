"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { login, signup } from "@/lib/api/auth";
import { apiErrorMessage } from "@/lib/api/client";
import { signupSchema, type SignupValues } from "@/lib/auth-schemas";
import { AuthCard } from "@/components/auth-card";
import { GuestOnly } from "@/components/guest-only";
import { SubmitButton } from "@/components/form/submit-button";
import { TextField } from "@/components/form/text-field";

export default function SignupPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) });

  /** Signup doesn't set auth cookies, so log in right after, then verify. */
  const signupMutation = useMutation({
    mutationFn: async (values: SignupValues) => {
      await signup(values);
      await login({ email: values.email, password: values.password });
    },
    onSuccess: () => {
      toast.success("Account created — let's verify your email.");
      router.push("/verify-email");
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  return (
    <GuestOnly>
    <AuthCard
      eyebrow="Join the shelf"
      title="Create your account"
      subtitle="Track orders, keep a wishlist, check out faster."
    >
      <form
        onSubmit={handleSubmit((values) => signupMutation.mutate(values))}
        className="space-y-5"
      >
        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="First name"
            autoComplete="given-name"
            placeholder="Omar"
            error={errors.firstName?.message}
            registration={register("firstName")}
          />
          <TextField
            label="Last name"
            autoComplete="family-name"
            placeholder="Hashad"
            error={errors.lastName?.message}
            registration={register("lastName")}
          />
        </div>
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          registration={register("email")}
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="8+ chars, 1 uppercase, 1 number, 1 symbol"
          error={errors.password?.message}
          registration={register("password")}
        />
        <TextField
          label="Phone number (optional)"
          type="tel"
          autoComplete="tel"
          placeholder="+20 100 000 0000"
          error={errors.phoneNumber?.message}
          registration={register("phoneNumber")}
        />

        <SubmitButton pending={signupMutation.isPending}>
          Create account
        </SubmitButton>
      </form>

      <p className="type-caption mt-6 text-center text-shade-50">
        Already have an account?{" "}
        <Link href="/login" className="text-ink underline underline-offset-2">
          Log in
        </Link>
      </p>
    </AuthCard>
    </GuestOnly>
  );
}
