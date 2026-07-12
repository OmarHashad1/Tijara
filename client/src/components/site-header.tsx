"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, ShoppingBag, UserRound } from "lucide-react";
import { Spinner } from "./spinner";
import { Wordmark } from "./wordmark";
import { useUser, useLogout } from "@/lib/hooks/use-user";
import { useCart } from "@/lib/hooks/use-cart";
import { useCartUi } from "@/lib/stores/cart-ui";

function AccountMenu() {
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const logoutMutation = useLogout();

  if (!user) return null;

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Account menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full p-2 transition-opacity hover:opacity-70"
      >
        <UserRound strokeWidth={1.5} className="h-5 w-5" />
        <span className="type-caption hidden lg:inline">{user.firstName}</span>
      </button>

      {open && (
        <>
          {/* click-away layer */}
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-2 w-44 rounded-lg border border-hairline-light bg-canvas-light py-2 shadow-elev-4">
            {[
              { label: "Account", href: "/account" },
              { label: "Orders", href: "/orders" },
              { label: "Wishlist", href: "/wishlist" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="type-caption block px-4 py-2 text-ink hover:bg-canvas-cream"
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              disabled={logoutMutation.isPending}
              onClick={() => logoutMutation.mutate()}
              className="type-caption block w-full px-4 py-2 text-left text-shade-50 hover:bg-canvas-cream hover:text-ink"
            >
              {logoutMutation.isPending ? <Spinner className="h-3.5 w-3.5" /> : "Log out"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * nav-bar-dark / nav-bar-light (Design_Guide). Cinematic pages get the black
 * bar; transactional pages the light one. Same structure, inverse polarity.
 */
export function SiteHeader({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const dark = variant === "dark";
  const { isLoggedIn } = useUser();
  const { itemCount } = useCart();
  const openDrawer = useCartUi((state) => state.openDrawer);

  return (
    <header
      className={
        dark
          ? "bg-canvas-night text-on-primary"
          : "border-b border-hairline-light bg-canvas-light text-ink"
      }
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4">
        <Wordmark />

        <nav className="type-body-md hidden items-center gap-8 md:flex">
          <Link href="/products" className="hover:opacity-70">
            Shop
          </Link>
          <Link href="/brands" className="hover:opacity-70">
            Brands
          </Link>
        </nav>

        <div className="flex items-center gap-1.5">
          {isLoggedIn ? (
            <>
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className="rounded-full p-2 transition-opacity hover:opacity-70"
              >
                <Heart strokeWidth={1.5} className="h-5 w-5" />
              </Link>
              <AccountMenu />
            </>
          ) : (
            <Link
              href="/login"
              className={`btn-pill mr-1.5 hidden px-5! py-2! md:inline-flex ${
                dark ? "btn-outline-on-dark" : "btn-outline-on-light"
              }`}
            >
              Log in
            </Link>
          )}

          <button
            type="button"
            aria-label={`Cart, ${itemCount} items`}
            onClick={openDrawer}
            className="relative rounded-full p-2 transition-opacity hover:opacity-70"
          >
            <ShoppingBag strokeWidth={1.5} className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="type-micro absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-aloe px-1 text-ink">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
