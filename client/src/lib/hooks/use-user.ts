"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getMe, logout } from "@/lib/api/auth";
import { apiErrorMessage } from "@/lib/api/client";

export function useUser() {
  const { data: user, isPending } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    staleTime: 5 * 60_000,
    retry: false,
  });

  return { user: user ?? null, isPending, isLoggedIn: Boolean(user) };
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      toast.success("Logged out — see you soon.");
      router.push("/");
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });
}
