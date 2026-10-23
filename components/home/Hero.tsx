"use client";

import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, useState } from "react";
import type { Product } from "@/lib/types";
import { site } from "@/lib/site";
import { formatPrice } from "@/lib/format";
import { ProductMedia } from "../ProductMedia";
import { ArrowIcon } from "../Icons";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero({ product }: { product: Product }) {
  const ref = useRef<HTMLElement>(null);
  const [idx, setIdx] = useState(0);
  const color = product.colors[idx];

  // Scroll parallax
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const shoeY = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const shoeRotate = useTransform(scrollYProgress, [0, 1], [0, -18]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Mouse parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 15 });
  const sy = useSpring(my, { stiffness: 80, damping: 15 });
  const tiltX = useTransform(sy, [-0.5, 0.5], [10, -10]);
  const tiltY = useTransform(sx, [-0.5, 0.5], [-14, 14]);
  const moveX = useTransform(sx, [-0.5, 0.5], [-30, 30]);

  const words = site.tagline.toUpperCase().split(" ");

  return (
    <section
      ref={ref}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="relative isolate min-h-[calc(100svh-100px)] overflow-hidden"
    >
      <motion.div className="absolute inset-0 -z-10" animate={{ backgroundColor: color.bg }} transition={{ duration: 0.8 }} />
      <motion.div
        className="absolute left-1/2 top-1/2 -z-10 aspect-square w-[min(90vw,760px)] -translate-x-1/2 -translate-y-1/2 rounded-full"
        animate={{ backgroundColor: color.base, scale: [0.9, 1] }}
        transition={{ duration: 0.8, ease }}
        style={{ opacity: 0.22 }}
      />

      {/* Giant headline */}
      <motion.h1
        style={{ y: textY, opacity: fade }}
        className="pointer-events-none absolute inset-x-0 top-[6%] flex flex-col items-center font-display uppercase leading-[0.85] tracking-tight"
      >
        {words.map((w, i) => (
          <span key={w + i} className="block overflow-hidden">
            <motion.span
              className="block text-[clamp(4.5rem,12.5vw,12.5rem)]"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.15 + i * 0.12, ease }}
            >
              {w}
            </motion.span>
          </span>
        ))}
      </motion.h1>

      {/* Shoe */}
      <motion.div
        style={{ y: shoeY, rotate: shoeRotate, x: moveX }}
        className="absolute inset-x-0 top-[38%] mx-auto flex w-[min(88vw,720px)] justify-center [perspective:1200px] sm:top-[34%]"
      >
        <motion.div style={{ rotateX: tiltX, rotateY: tiltY }} className="w-full">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={color.name}
              initial={{ x: 300, opacity: 0, rotate: 20 }}
              animate={{ x: 0, opacity: 1, rotate: 0 }}
              exit={{ x: -300, opacity: 0, rotate: -20 }}
              transition={{ duration: 0.7, ease }}
              className="relative grid aspect-[2/1] place-items-center"
            >
              <div className="relative grid size-full animate-float place-items-center">
                <ProductMedia product={product} color={color} className="!w-full drop-shadow-2xl" sizes="900px" />
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Bottom bar */}
      <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[1440px] flex-col gap-6 px-4 pb-8 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8, ease }}>
          <p className="text-sm font-medium uppercase tracking-widest">Just dropped</p>
          <h2 className="mt-1 text-3xl font-semibold sm:text-4xl">{product.title}</h2>
          <p className="mt-1 text-muted">
            {product.subtitle} · {formatPrice(product.price, product.currency)}
          </p>
          <div className="mt-5 flex gap-3">
            <Link
              href={`/products/${product.handle}`}
              className="group flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-medium text-paper transition-transform hover:scale-105"
            >
              Shop now <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/collections/all"
              className="rounded-full border border-ink/20 bg-paper/60 px-6 py-3 font-medium backdrop-blur transition-colors hover:border-ink"
            >
              Explore all
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8, ease }}
          className="flex items-center gap-4"
        >
          <span className="font-display text-2xl tabular-nums">
            0{idx + 1}
            <span className="text-muted">/0{product.colors.length}</span>
          </span>
          <div className="flex gap-2">
            {product.colors.map((c, i) => (
              <button
                key={c.name}
                onClick={() => setIdx(i)}
                aria-label={`Show ${c.name}`}
                className="relative size-10 rounded-full border-2 border-paper shadow-md transition-transform hover:scale-110"
                style={{ background: c.base }}
              >
                {i === idx && (
                  <motion.span layoutId="hero-swatch" className="absolute -inset-1.5 rounded-full border-2 border-ink" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
