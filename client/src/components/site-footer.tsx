import Link from "next/link";

const LINK_GROUPS: { title: string; links: { label: string; href: string }[] }[] =
  [
    {
      title: "Shop",
      links: [
        { label: "All products", href: "/products" },
        { label: "Brands", href: "/brands" },
        { label: "Wishlist", href: "/wishlist" },
        { label: "Cart", href: "/cart" },
      ],
    },
    {
      title: "Account",
      links: [
        { label: "Log in", href: "/login" },
        { label: "Sign up", href: "/signup" },
        { label: "Orders", href: "/orders" },
        { label: "Profile", href: "/account" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Shipping", href: "#" },
        { label: "Returns", href: "#" },
        { label: "Contact", href: "#" },
      ],
    },
  ];

/**
 * footer-dark, reworked: a drop-CTA row, muted link groups, then the brand's
 * loudest quiet moment — a viewport-wide thin wordmark ghosted at low opacity,
 * clipped at the page's bottom edge.
 */
export function SiteFooter() {
  return (
    <footer className="overflow-hidden bg-canvas-night px-6 pt-20 text-on-primary">
      <div className="mx-auto max-w-[1600px]">
        {/* CTA row */}
        <div className="flex flex-col gap-8 border-b border-white/10 pb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="type-eyebrow mb-4 text-link-mint">
              Every Friday, one drop
            </p>
            <p className="type-display-md max-w-2xl">
              Never miss the shelf restock.
            </p>
          </div>
          <Link
            href="/signup"
            className="btn-pill btn-outline-on-dark shrink-0 self-start md:self-auto"
          >
            Create an account
          </Link>
        </div>

        {/* Link groups */}
        <div className="flex flex-col justify-between gap-12 py-14 md:flex-row">
          <p className="type-caption max-w-xs text-link-cool-2">
            Everyday essentials, considered. A single-vendor commerce studio
            for apparel, footwear, home and personal care.
          </p>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {LINK_GROUPS.map((group) => (
              <div key={group.title}>
                <p className="type-eyebrow mb-4 text-shade-60">{group.title}</p>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="type-caption text-link-cool-1 underline-offset-2 hover:text-on-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Legal row */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 py-6">
          <p className="type-micro text-shade-60">
            © {new Date().getFullYear()} Tijara. All rights reserved.
          </p>
          <p className="type-micro text-shade-60">
            Cards accepted · Cash on delivery
          </p>
        </div>

        {/* Ghost wordmark signature, clipped at the page edge */}
        <p
          aria-hidden
          className="pointer-events-none -mb-[0.28em] select-none text-center font-display text-[19vw] font-[330] leading-none tracking-[0.02em] text-white/10"
        >
          TIJARA
        </p>
      </div>
    </footer>
  );
}
