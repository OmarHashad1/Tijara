"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

/**
 * Art-directed hero merchandise. Seed-data product images are placeholder
 * hosts, so the collage uses curated stills that link into the catalog.
 */
const HERO_PRODUCTS = [
  {
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=900&auto=format&fit=crop",
    alt: "Red running sneaker",
    price: "$120",
    className: "left-0 top-10 w-[46%] -rotate-6 z-10",
    floatDelay: 0,
  },
  {
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=900&auto=format&fit=crop",
    alt: "Minimal wristwatch",
    price: "$95",
    className: "right-0 top-0 w-[42%] rotate-3 z-20",
    floatDelay: 1.6,
  },
  {
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=900&auto=format&fit=crop",
    alt: "Over-ear headphones",
    price: "$249",
    className: "bottom-0 left-[22%] w-[48%] rotate-2 z-30",
    floatDelay: 3.2,
  },
];

/**
 * Merchandise-first hero on the cream canvas: thin display type on the left,
 * an overlapping product collage with price tags on the right. The night
 * canvas now only bookends the page (closer + footer).
 */
export function Hero() {
  const reduceMotion = useReducedMotion();

  const enter = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 32 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: EASE },
        };

  return (
    <section className="overflow-hidden bg-canvas-cream">
      <div className="mx-auto grid max-w-[1600px] items-center gap-16 px-6 pb-20 pt-14 md:pb-28 md:pt-20 lg:grid-cols-2">
        <div>
          <motion.p
            {...enter(0)}
            className="type-eyebrow mb-7 inline-block rounded-full bg-aloe px-3 py-1.5 text-ink"
          >
            Season 07 · The Essentials Drop
          </motion.p>

          <motion.h1 {...enter(0.12)} className="type-display-xxl text-ink">
            Everyday
            <br />
            goods,
            <br />
            <span className="relative inline-block">
              considered.
              <svg
                viewBox="0 0 300 14"
                aria-hidden
                className="absolute -bottom-2 left-0 w-full"
                preserveAspectRatio="none"
              >
                <path
                  d="M4 10 C 60 2, 150 2, 296 8"
                  fill="none"
                  stroke="var(--color-aloe)"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            {...enter(0.24)}
            className="type-body-lg mt-9 max-w-md text-shade-50"
          >
            Footwear, apparel and home essentials from brands we actually vet.
            No noise, no filler — just the shelf we&apos;d stock for ourselves.
          </motion.p>

          <motion.div
            {...enter(0.36)}
            className="mt-10 flex flex-wrap items-center gap-5"
          >
            <Link href="/products" className="btn-pill btn-primary">
              Shop the collection
            </Link>
            <Link
              href="/brands"
              className="type-body-md text-shade-50 underline-offset-4 hover:text-ink hover:underline"
            >
              Browse brands →
            </Link>
          </motion.div>
        </div>

        {/* Product collage: overlapping frames, price tags, slow float */}
        <motion.div
          {...(reduceMotion
            ? {}
            : {
                initial: { opacity: 0, scale: 0.96 },
                animate: { opacity: 1, scale: 1 },
                transition: { duration: 1, delay: 0.3, ease: EASE },
              })}
          className="relative mx-auto aspect-square w-full max-w-[620px]"
        >
          {HERO_PRODUCTS.map((tile) => (
            <motion.div
              key={tile.alt}
              className={`absolute ${tile.className}`}
              animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
              transition={
                reduceMotion
                  ? undefined
                  : {
                      duration: 7,
                      delay: tile.floatDelay,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
              }
            >
              <div className="rounded-lg bg-canvas-light p-3 shadow-elev-3">
                <div className="relative aspect-square overflow-hidden rounded-md bg-canvas-cream">
                  <Image
                    src={tile.image}
                    alt={tile.alt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 45vw, 300px"
                    className="object-cover"
                  />
                </div>
                <span className="type-body-strong absolute -bottom-3 left-5 rounded-full bg-ink px-3.5 py-1 text-on-primary shadow-elev-4">
                  {tile.price}
                </span>
              </div>
            </motion.div>
          ))}

          <motion.span
            className="type-eyebrow absolute -right-2 bottom-[18%] z-40 rotate-12 rounded-full bg-aloe px-4 py-2.5 text-ink shadow-elev-3"
            animate={reduceMotion ? undefined : { rotate: [12, 6, 12] }}
            transition={
              reduceMotion
                ? undefined
                : { duration: 9, repeat: Infinity, ease: "easeInOut" }
            }
          >
            New drop ✦ Fri
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}
