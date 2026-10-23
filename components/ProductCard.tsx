"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { ProductMedia } from "./ProductMedia";
import { useCart } from "./CartProvider";
import { PlusIcon } from "./Icons";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const [colorIdx, setColorIdx] = useState(0);
  const [hover, setHover] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const color = product.colors[colorIdx];
  const { add } = useCart();

  function quickAdd(size: string) {
    const variant = product.variants.find(
      (v) => Object.values(v.options).includes(size) && (product.colors.length < 2 || Object.values(v.options).includes(color.name)),
    );
    add({
      key: `${product.handle}-${color.name}-${size}`,
      handle: product.handle,
      title: product.title,
      subtitle: product.subtitle,
      price: product.price,
      currency: product.currency,
      color,
      size,
      image: product.images[0],
      variantId: variant?.id,
    });
    setSizeOpen(false);
  }

  return (
    <motion.article
      layout
      className="group"
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => {
        setHover(false);
        setSizeOpen(false);
      }}
    >
      <div className="relative aspect-square overflow-hidden rounded-sm">
        <Link href={`/products/${product.handle}`} aria-label={product.title} className="absolute inset-0">
          <motion.div
            className="absolute inset-0"
            animate={{ backgroundColor: color.bg }}
            transition={{ duration: 0.4 }}
          />
          <motion.div
            className="absolute inset-0 grid place-items-center"
            animate={hover ? { scale: 1.08, rotate: -8, y: -10 } : { scale: 1, rotate: 0, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
          >
            <ProductMedia product={product} color={color} index={hover ? 1 : 0} />
          </motion.div>
        </Link>

        {product.badge && (
          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-paper px-3 py-1 text-xs font-semibold">
            {product.badge}
          </span>
        )}

        <div className="absolute inset-x-3 bottom-3 translate-y-[calc(100%+1rem)] transition-transform duration-300 ease-out group-hover:translate-y-0 group-focus-within:translate-y-0">
          <AnimatePresence mode="wait">
            {sizeOpen ? (
              <motion.div
                key="sizes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="grid grid-cols-4 gap-1 rounded-xl bg-paper/95 p-2 backdrop-blur"
              >
                {product.sizes.slice(0, 12).map((s) => (
                  <button
                    key={s}
                    onClick={() => quickAdd(s)}
                    className="rounded-md border border-line py-1.5 text-xs font-medium transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                  >
                    {s}
                  </button>
                ))}
              </motion.div>
            ) : (
              <motion.button
                key="add"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onClick={() => setSizeOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3 text-sm font-medium text-paper"
              >
                <PlusIcon /> Quick add
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-3 flex gap-1.5">
        {product.colors.map((c, i) => (
          <button
            key={c.name}
            onClick={() => setColorIdx(i)}
            onMouseEnter={() => setColorIdx(i)}
            aria-label={c.name}
            className={`size-5 rounded-full border-2 transition-transform hover:scale-110 ${i === colorIdx ? "border-ink" : "border-transparent"}`}
          >
            <span className="block size-full rounded-full border border-black/10" style={{ background: c.base }} />
          </button>
        ))}
      </div>

      <Link href={`/products/${product.handle}`} className="mt-2 block">
        {product.badge && <p className="text-sm font-medium text-flame">{product.badge === "Sale" ? "Sale" : product.badge}</p>}
        <h3 className="font-medium">{product.title}</h3>
        <p className="text-muted">{product.subtitle}</p>
        <p className="text-muted">{product.colors.length} Colour{product.colors.length > 1 ? "s" : ""}</p>
        <p className="mt-1 font-medium">
          {formatPrice(product.price, product.currency)}
          {product.compareAtPrice && (
            <span className="ml-2 font-normal text-muted line-through">{formatPrice(product.compareAtPrice, product.currency)}</span>
          )}
        </p>
      </Link>
    </motion.article>
  );
}
