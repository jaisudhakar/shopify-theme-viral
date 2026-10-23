"use client";

import Image from "next/image";
import { AnimatePresence, motion, useAnimationControls } from "motion/react";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { cx, formatPrice } from "@/lib/format";
import { useCart } from "./CartProvider";
import { ShoeArt } from "./ShoeArt";
import { ChevronIcon, HeartIcon } from "./Icons";

// Angles used for the vector artwork gallery.
const artViews = [
  { label: "Side", style: "" },
  { label: "Medial", style: "-scale-x-100" },
  { label: "Angled", style: "-rotate-[22deg] scale-90" },
  { label: "Detail", style: "scale-[1.9] translate-x-[18%] translate-y-[6%]" },
  { label: "Sole", style: "rotate-180 scale-90" },
];

export function ProductDetail({ product }: { product: Product }) {
  const [colorIdx, setColorIdx] = useState(0);
  const [view, setView] = useState(0);
  const [size, setSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);
  const [fav, setFav] = useState(false);
  const shake = useAnimationControls();
  const { add } = useCart();
  const color = product.colors[colorIdx];
  const hasPhotos = product.images.length > 0;
  const views = hasPhotos ? product.images.map((_, i) => ({ label: `Image ${i + 1}`, style: "" })) : artViews;

  function variantFor(s: string) {
    return product.variants.find((v) => {
      const values = Object.values(v.options);
      return values.includes(s) && (product.colors.length < 2 || values.includes(color.name));
    });
  }

  function addToBag() {
    if (!size) {
      setSizeError(true);
      shake.start({ x: [0, -10, 10, -6, 6, 0], transition: { duration: 0.4 } });
      return;
    }
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
      variantId: variantFor(size)?.id,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="mx-auto grid max-w-[1440px] gap-10 px-4 pt-6 sm:px-8 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
      {/* Gallery */}
      <div className="flex flex-col-reverse gap-4 lg:sticky lg:top-6 lg:h-fit lg:flex-row">
        <div className="flex gap-3 overflow-x-auto no-scrollbar lg:flex-col">
          {views.map((v, i) => (
            <button
              key={v.label}
              onMouseEnter={() => setView(i)}
              onClick={() => setView(i)}
              aria-label={v.label}
              className={cx(
                "relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-lg transition-opacity",
                view === i ? "opacity-100 ring-2 ring-ink" : "opacity-60 hover:opacity-100",
              )}
              style={{ background: color.bg }}
            >
              {hasPhotos ? (
                <Image src={product.images[i]} alt="" fill sizes="64px" className="object-cover" />
              ) : (
                <ShoeArt color={color} className={cx("w-[88%]", v.style)} />
              )}
            </button>
          ))}
        </div>

        <motion.div
          className="relative grid aspect-square flex-1 place-items-center overflow-hidden rounded-xl"
          animate={{ backgroundColor: color.bg }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={`${view}-${colorIdx}`}
              initial={{ opacity: 0, x: 80, rotate: 6 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              exit={{ opacity: 0, x: -80, rotate: -6 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 grid place-items-center"
            >
              {hasPhotos ? (
                <Image src={product.images[view]} alt={product.title} fill priority sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" />
              ) : (
                <ShoeArt color={color} className={cx("w-[86%] transition-transform duration-500", views[view].style)} />
              )}
            </motion.div>
          </AnimatePresence>
          {product.badge && (
            <span className="absolute left-4 top-4 rounded-full bg-paper px-3 py-1 text-sm font-semibold">{product.badge}</span>
          )}
        </motion.div>
      </div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="lg:max-w-md"
      >
        <h1 className="text-3xl font-medium">{product.title}</h1>
        <p className="mt-1 text-lg">{product.subtitle}</p>
        <p className="mt-4 text-xl font-medium">
          {formatPrice(product.price, product.currency)}
          {product.compareAtPrice && (
            <>
              <span className="ml-3 font-normal text-muted line-through">
                {formatPrice(product.compareAtPrice, product.currency)}
              </span>
              <span className="ml-3 text-base text-emerald-700">
                {Math.round((1 - product.price / product.compareAtPrice) * 100)}% off
              </span>
            </>
          )}
        </p>

        <div className="mt-8">
          <p className="mb-3 text-sm font-medium">
            Colour: <span className="text-muted">{color.name}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c, i) => (
              <button
                key={c.name}
                onClick={() => setColorIdx(i)}
                aria-label={c.name}
                className="relative grid size-[72px] place-items-center overflow-hidden rounded-lg"
                style={{ background: c.bg }}
              >
                <ShoeArt color={c} className="w-[90%]" />
                {i === colorIdx && (
                  <motion.span layoutId="pdp-color" className="absolute inset-0 rounded-lg ring-2 ring-inset ring-ink" />
                )}
              </button>
            ))}
          </div>
        </div>

        <motion.div animate={shake} className="mt-8">
          <div className="mb-3 flex justify-between text-sm font-medium">
            <span className={cx(sizeError && "text-red-600")}>Select size</span>
            <button className="text-muted underline">Size guide</button>
          </div>
          <div
            className={cx(
              "grid grid-cols-3 gap-2 rounded-lg sm:grid-cols-4",
              sizeError && "ring-1 ring-red-600 ring-offset-4",
            )}
          >
            {product.sizes.map((s) => {
              const variant = variantFor(s);
              const soldOut = variant ? !variant.available : false;
              return (
                <motion.button
                  key={s}
                  whileTap={{ scale: 0.94 }}
                  disabled={soldOut}
                  onClick={() => {
                    setSize(s);
                    setSizeError(false);
                  }}
                  className={cx(
                    "rounded-md border py-3 text-[15px] transition-colors",
                    size === s ? "border-ink bg-ink text-paper" : "border-line hover:border-ink",
                    soldOut && "cursor-not-allowed bg-mist text-muted line-through hover:border-line",
                  )}
                >
                  {s}
                </motion.button>
              );
            })}
          </div>
          {sizeError && <p className="mt-2 text-sm text-red-600">Please select a size.</p>}
        </motion.div>

        <div className="mt-8 space-y-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={addToBag}
            className="relative h-16 w-full overflow-hidden rounded-full bg-ink text-lg font-medium text-paper"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={added ? "added" : "add"}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                className="absolute inset-0 grid place-items-center"
              >
                {added ? "✓ Added to Bag" : "Add to Bag"}
              </motion.span>
            </AnimatePresence>
          </motion.button>
          <button
            onClick={() => setFav((f) => !f)}
            className="flex h-16 w-full items-center justify-center gap-2 rounded-full border border-line text-lg font-medium transition-colors hover:border-ink"
          >
            Favourite
            <motion.span animate={fav ? { scale: [1, 1.4, 1] } : { scale: 1 }} className={cx(fav && "text-red-500 [&_path]:fill-current")}>
              <HeartIcon />
            </motion.span>
          </button>
        </div>

        <p className="mt-8 leading-relaxed">{product.description}</p>
        <ul className="mt-4 list-inside list-disc space-y-1 text-[15px]">
          <li>Shown: {color.name}</li>
          <li>Style: {product.handle.toUpperCase()}</li>
        </ul>

        <div className="mt-8 border-t border-line">
          <Accordion title="Free Delivery and Returns">
            Free standard delivery on orders over $50. You can return your order for any reason, free of charge, within 30
            days.
          </Accordion>
          <Accordion title="Product Details">
            Breathable upper, responsive cushioning and a durable rubber outsole. Imported. Colours may vary slightly.
          </Accordion>
          <Accordion title="Reviews">
            No reviews yet. Be the first to share how they feel.
          </Accordion>
        </div>
      </motion.div>
    </div>
  );
}

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between py-6 text-lg font-medium">
        {title}
        <ChevronIcon className={cx("transition-transform duration-300", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-[15px] leading-relaxed">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
