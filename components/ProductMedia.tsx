"use client";

import Image from "next/image";
import type { Colorway, Product } from "@/lib/types";
import { ShoeArt } from "./ShoeArt";
import { cx } from "@/lib/format";

/** Shows the Shopify photo when available, otherwise the vector shoe. */
export function ProductMedia({
  product,
  color,
  index = 0,
  className,
  sizes = "(min-width: 1024px) 33vw, 50vw",
}: {
  product: Product;
  color: Colorway;
  index?: number;
  className?: string;
  sizes?: string;
}) {
  const src = product.images[index % Math.max(product.images.length, 1)];
  if (src) {
    return (
      <Image src={src} alt={product.title} fill sizes={sizes} className={cx("object-cover", className)} />
    );
  }
  return <ShoeArt color={color} className={cx("h-auto w-[82%]", className)} />;
}
