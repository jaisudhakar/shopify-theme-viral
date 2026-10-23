"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { ProductMedia } from "../ProductMedia";

/** Sticky section whose cards slide sideways as you scroll down. */
export function HorizontalShowcase({ products, title }: { products: Product[]; title: string }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (track.current) setDistance(Math.max(track.current.scrollWidth - window.innerWidth, 0));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [products.length]);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={section} className="relative bg-ink text-paper" style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-10 flex w-full max-w-[1440px] items-end justify-between px-4 sm:px-8">
          <h2 className="font-display text-[clamp(3rem,8vw,7rem)] uppercase leading-none">{title}</h2>
          <div className="mb-3 hidden h-1 w-48 overflow-hidden rounded-full bg-white/15 sm:block">
            <motion.div className="h-full bg-volt" style={{ width: progress }} />
          </div>
        </div>
        <motion.div ref={track} style={{ x }} className="flex gap-6 px-4 sm:px-8">
          {products.map((p, i) => (
            <Link
              key={p.id}
              href={`/products/${p.handle}`}
              className="group relative flex h-[56vh] w-[min(78vw,460px)] shrink-0 flex-col justify-between overflow-hidden rounded-2xl p-6 text-ink"
              style={{ background: p.colors[0].bg }}
            >
              <div className="flex items-start justify-between">
                <span className="font-display text-6xl text-ink/15">{String(i + 1).padStart(2, "0")}</span>
                {p.badge && <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-paper">{p.badge}</span>}
              </div>
              <div className="relative grid flex-1 place-items-center transition-transform duration-700 ease-out group-hover:-translate-y-4 group-hover:-rotate-12 group-hover:scale-110">
                <ProductMedia product={p} color={p.colors[0]} className="!w-full" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold">{p.title}</h3>
                <p className="text-ink/60">
                  {p.subtitle} · {formatPrice(p.price, p.currency)}
                </p>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
