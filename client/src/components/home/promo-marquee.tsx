const PROMOS = [
  "Free shipping over $50",
  "Cash on delivery",
  "30-day returns",
  "New drop every Friday",
  "Curated brands only",
];

/**
 * Retail promo ticker on the night canvas. The track is rendered twice and
 * translated -50% so the loop is seamless.
 */
export function PromoMarquee() {
  const track = [...PROMOS, ...PROMOS];

  return (
    <div className="overflow-hidden bg-canvas-night py-3.5">
      <div className="flex w-max animate-marquee items-center motion-reduce:animate-none">
        {track.map((promo, i) => (
          <span
            key={`${promo}-${i}`}
            className="type-eyebrow flex shrink-0 items-center text-on-primary"
          >
            <span className="px-6">{promo}</span>
            <span aria-hidden className="text-shade-60">
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
