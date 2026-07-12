import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartDrawer } from "@/components/cart/cart-drawer";

/** Shared chrome for every storefront page except the composed homepage. */
export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader variant="light" />
      <main className="flex-1 bg-canvas-light">{children}</main>
      <SiteFooter />
      <CartDrawer />
    </>
  );
}
