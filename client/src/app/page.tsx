import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/home/hero";
import { PromoMarquee } from "@/components/home/promo-marquee";
import { FeaturedProducts } from "@/components/home/featured-products";
import { CategoryBand } from "@/components/home/category-band";
import { BrandStrip } from "@/components/home/brand-strip";
import { CloserBand } from "@/components/home/closer-band";
import { CartDrawer } from "@/components/cart/cart-drawer";

/**
 * Merchandise-first home: cream hero with a product collage, retail promo
 * ticker, product grid with a sale tile, category index, brand marquee —
 * the night canvas only bookends the page (closer + footer).
 */
export default function Home() {
  return (
    <>
      <SiteHeader variant="light" />
      <main>
        <Hero />
        <PromoMarquee />
        <FeaturedProducts />
        <CategoryBand />
        <BrandStrip />
        <CloserBand />
      </main>
      <SiteFooter />
      <CartDrawer />
    </>
  );
}
