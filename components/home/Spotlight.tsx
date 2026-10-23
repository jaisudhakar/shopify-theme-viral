"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { ProductMedia } from "../ProductMedia";

/** Full-width feature banner with parallax shoe and a spinning text badge. */
export function Spotlight({ product }: { product: Product }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["-25%", "15%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [10, -25]);
  const bgX = useTransform(scrollYProgress, [0, 1], ["10%", "-30%"]);
  const color = product.colors[0];

  return (
    <section ref={ref} className="relative mx-4 overflow-hidden rounded-3xl sm:mx-8" style={{ background: color.base }}>
      <motion.p
        style={{ x: bgX }}
        className="pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap font-display text-[22vw] uppercase leading-none text-black/10"
      >
        {product.title} {product.title}
      </motion.p>

      <div className="relative grid min-h-[80vh] items-center gap-8 px-6 py-16 md:grid-cols-2 md:px-14">
        <div className="relative z-10 max-w-md">
          <p className="text-sm font-semibold uppercase tracking-widest">Spotlight</p>
          <h2 className="mt-3 font-display text-[clamp(3rem,7vw,6rem)] uppercase leading-[0.9]">{product.title}</h2>
          <p className="mt-4 text-lg text-ink/75">{product.description}</p>
          <div className="mt-8 flex items-center gap-5">
            <Link
              href={`/products/${product.handle}`}
              className="rounded-full bg-ink px-7 py-3.5 font-medium text-paper transition-transform hover:scale-105"
            >
              Shop {formatPrice(product.price, product.currency)}
            </Link>
          </div>
        </div>

        <div className="relative grid place-items-center">
          <motion.div style={{ x, rotate }} className="relative grid aspect-[2/1] w-[min(110%,760px)] place-items-center">
            <ProductMedia product={product} color={color} className="!w-full drop-shadow-2xl" sizes="760px" />
          </motion.div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 14, ease: "linear" }}
            className="absolute right-2 top-0 size-28 sm:size-36"
          >
            <svg viewBox="0 0 100 100" className="size-full">
              <defs>
                <path id="badge-circle" d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" />
              </defs>
              <circle cx="50" cy="50" r="50" fill="#111" />
              <text fill="#fff" fontSize="10.5" fontWeight="700" letterSpacing="2.2">
                <textPath href="#badge-circle">LIMITED DROP • LIMITED DROP • </textPath>
              </text>
              <text x="50" y="57" textAnchor="middle" fill={color.base} fontSize="22" fontWeight="900">
                ★
              </text>
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
