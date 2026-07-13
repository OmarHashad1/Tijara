"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { login } from "@/lib/api/auth";
import { apiErrorMessage } from "@/lib/api/client";
import { loginSchema, type LoginValues } from "@/lib/auth-schemas";
import { AuthCard } from "@/components/auth-card";
import { GuestOnly } from "@/components/guest-only";
import { TextField } from "@/components/form/text-field";
import { SubmitButton } from "@/components/form/submit-button";

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Welcome back!");
      router.push("/");
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });

  return (
    <GuestOnly>
    <AuthCard
      eyebrow="Welcome back"
      title="Log in to Tijara"
      subtitle="Your cart, wishlist and orders are waiting."
    >
      <form
        onSubmit={handleSubmit((values) => loginMutation.mutate(values))}
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
        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          registration={register("password")}
        />

        <div className="flex items-center justify-between pt-1">
          <Link
            href="/forgot-password"
            className="type-caption text-shade-50 underline-offset-2 hover:text-ink hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <SubmitButton pending={loginMutation.isPending}>Log in</SubmitButton>
      </form>

      <p className="type-caption mt-6 text-center text-shade-50">
        New to Tijara?{" "}
        <Link
          href="/signup"
          className="text-ink underline underline-offset-2"
        >
          Create an account
        </Link>
      </p>
    </AuthCard>
    </GuestOnly>
  );
}
