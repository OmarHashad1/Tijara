"use client";

import { useState } from "react";
import { ProductImage } from "@/components/product-image";

/** pdp-gallery-frame: cream main frame with a thumbnail strip below. */
export function ProductGallery({
  images,
  productName,
}: {
  images: string[];
  productName: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-lg bg-canvas-cream">
        <ProductImage
          src={images[selectedIndex]}
          alt={`${productName} — image ${selectedIndex + 1}`}
        />
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto">
          {images.map((image, i) => (
            <button
              key={`${image}-${i}`}
              type="button"
              aria-label={`Show image ${i + 1}`}
              onClick={() => setSelectedIndex(i)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-canvas-cream transition-opacity ${
                i === selectedIndex
                  ? "ring-2 ring-ink"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <ProductImage src={image} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
