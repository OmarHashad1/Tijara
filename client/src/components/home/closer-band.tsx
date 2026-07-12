import Link from "next/link";
import { Reveal } from "@/components/reveal";

/** Cinematic closer: the page bookends back onto the night canvas. */
export function CloserBand() {
  return (
    <section className="bg-canvas-night px-6 py-28 text-on-primary md:py-40">
      <div className="mx-auto max-w-[1600px]">
        <Reveal>
          <p className="type-eyebrow mb-8 text-link-mint">Why Tijara</p>
          <h2 className="type-display-xl max-w-4xl">
            Commerce,
            <br />
            without the clutter.
          </h2>
          <p className="type-body-lg mt-8 max-w-xl text-shade-40">
            One storefront. A handful of brands worth carrying. Prices that
            don&apos;t need decoding. That&apos;s the whole pitch.
          </p>
          <div className="mt-12">
            <Link href="/signup" className="btn-pill btn-outline-on-dark">
              Create an account
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
