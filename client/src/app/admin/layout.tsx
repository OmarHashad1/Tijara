"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useUser } from "@/lib/hooks/use-user";
import { Wordmark } from "@/components/wordmark";
import { Spinner } from "@/components/spinner";

const NAV_ITEMS = [
  { label: "Overview", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Brands", href: "/admin/brands" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Coupons", href: "/admin/coupons" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Users", href: "/admin/users" },
  { label: "Reviews", href: "/admin/reviews" },
];

/**
 * Client-side role gate — the backend independently enforces ROLE.ADMIN
 * (403) on every /admin endpoint; this just keeps non-admins out of the UI.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isPending } = useUser();

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!isPending && !isAdmin) router.replace("/");
  }, [isPending, isAdmin, router]);

  if (isPending || !isAdmin) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-canvas-cream">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh bg-canvas-cream">
      <aside className="sticky top-0 flex h-dvh w-56 shrink-0 flex-col border-r border-hairline-light bg-canvas-light px-5 py-6">
        <Wordmark />
        <p className="type-eyebrow mt-1 text-shade-50">Back office</p>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`type-caption rounded-full px-4 py-2 transition-colors ${
                  active
                    ? "bg-aloe text-ink"
                    : "text-shade-60 hover:bg-canvas-cream hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/"
          className="type-caption flex items-center gap-2 text-shade-50 hover:text-ink"
        >
          <ArrowLeft strokeWidth={1.5} className="h-4 w-4" />
          Back to store
        </Link>
      </aside>

      <main className="min-w-0 flex-1 px-8 py-8">{children}</main>
    </div>
  );
}
