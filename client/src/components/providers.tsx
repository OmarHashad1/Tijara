"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";

/**
 * Toasts wear the design system: pill geometry, light-track aloe for
 * success, ink-on-white base, night-canvas ink panel for errors (the
 * system has no alarm red).
 */
const TOAST_CLASSNAMES = {
  // Background/text live on the per-type classes only, so variants don't
  // have to out-specificity a base background.
  toast:
    "rounded-full! border! shadow-elev-4! px-5! py-3.5! w-fit! font-[var(--font-body)]!",
  title: "text-sm! font-medium! tracking-[0.01em]!",
  default: "bg-canvas-light! border-hairline-light! text-ink!",
  success: "bg-aloe! border-aloe! text-ink!",
  error: "bg-ink! border-ink! text-on-primary!",
  info: "bg-pistachio! border-pistachio! text-ink!",
  icon: "text-current!",
};

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-center"
        gap={10}
        toastOptions={{ unstyled: false, classNames: TOAST_CLASSNAMES }}
      />
    </QueryClientProvider>
  );
}
