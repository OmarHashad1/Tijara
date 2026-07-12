"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/hooks/use-user";

/** Wraps auth pages (login/signup/…): logged-in users get bounced home. */
export function GuestOnly({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoggedIn, isPending } = useUser();

  useEffect(() => {
    if (!isPending && isLoggedIn) router.replace("/");
  }, [isPending, isLoggedIn, router]);

  if (isPending || isLoggedIn) return null;
  return <>{children}</>;
}
