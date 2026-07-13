"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductImage } from "@/components/product-image";

/**
 * pdp-gallery-frame as a carousel: cream main frame with slide transitions,
 * arrow controls and a counter when there's more than one image, plus a
 * thumbnail strip. Every image resolves from its S3 key (placeholder on
 * failure), so a product with N images always shows N navigable frames.
 */
export function ProductGallery({
  images,
  productName,
}: {
  images: string[];
  productName: string;
}) {
  const reduceMotion = useReducedMotion();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);

  const frames = images.length > 0 ? images : [undefined];
  const hasMultiple = frames.length > 1;

  function goTo(index: number) {
    setSlideDirection(index > selectedIndex ? 1 : -1);
    setSelectedIndex((index + frames.length) % frames.length);
  }

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-lg bg-canvas-cream">
        <AnimatePresence initial={false} custom={slideDirection} mode="popLayout">
          <motion.div
            key={selectedIndex}
            custom={slideDirection}
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { x: slideDirection * 48, opacity: 0 }
            }
            animate={{ x: 0, opacity: 1 }}
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { x: slideDirection * -48, opacity: 0 }
            }
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-0"
          >
            <ProductImage
              src={frames[selectedIndex]}
              alt={`${productName} — image ${selectedIndex + 1} of ${frames.length}`}
            />
          </motion.div>
        </AnimatePresence>

        {hasMultiple && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => goTo(selectedIndex - 1)}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-canvas-light/90 p-2 shadow-elev-3 transition-colors hover:bg-canvas-light"
            >
              <ChevronLeft strokeWidth={1.5} className="h-5 w-5 text-ink" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => goTo(selectedIndex + 1)}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-canvas-light/90 p-2 shadow-elev-3 transition-colors hover:bg-canvas-light"
            >
              <ChevronRight strokeWidth={1.5} className="h-5 w-5 text-ink" />
            </button>
            <span className="type-micro absolute bottom-3 right-3 z-10 rounded-full bg-canvas-light/90 px-2.5 py-1 text-shade-60 shadow-elev-3">
              {selectedIndex + 1} / {frames.length}
            </span>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {frames.map((imageKey, i) => (
            <button
              key={`${imageKey ?? "placeholder"}-${i}`}
              type="button"
              aria-label={`Show image ${i + 1}`}
              aria-current={i === selectedIndex}
              onClick={() => goTo(i)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-canvas-cream transition-opacity ${
                i === selectedIndex
                  ? "ring-2 ring-ink"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <ProductImage src={imageKey} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
