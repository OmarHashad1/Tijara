"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "Profile", href: "/account" },
  { label: "Addresses", href: "/account/addresses" },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
      <h1 className="type-display-lg mb-8">Account</h1>

      <nav className="mb-10 flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`type-eyebrow rounded-full px-3.5 py-2 transition-colors ${
              pathname === tab.href
                ? "bg-aloe text-ink"
                : "bg-shade-30 text-ink hover:bg-aloe/60"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {children}
    </div>
  );
}
