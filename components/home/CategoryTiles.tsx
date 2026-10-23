"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { Product } from "@/lib/types";
import { ProductMedia } from "../ProductMedia";
import { ArrowIcon } from "../Icons";

type Tile = { title: string; href: string; product: Product; tone: string };

export function CategoryTiles({ tiles }: { tiles: Tile[] }) {
  return (
    <section className="mx-auto max-w-[1440px] px-4 sm:px-8">
      <h2 className="mb-6 text-2xl font-medium">Shop by category</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {tiles.map((t, i) => (
          <motion.div
            key={t.title}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={t.href}
              className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl p-7"
              style={{ background: t.tone }}
            >
              <span className="pointer-events-none absolute -right-4 top-2 font-display text-[11rem] uppercase leading-none text-white/25 transition-transform duration-700 group-hover:-translate-x-6">
                {t.title}
              </span>
              <div className="absolute inset-0 grid place-items-center transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-6 group-hover:-rotate-[18deg] group-hover:scale-110">
                <ProductMedia product={t.product} color={t.product.colors[0]} className="!w-[88%] -rotate-6" />
              </div>
              <div className="relative flex items-center justify-between">
                <h3 className="font-display text-5xl uppercase text-paper drop-shadow">{t.title}</h3>
                <span className="grid size-12 place-items-center rounded-full bg-paper transition-transform duration-300 group-hover:rotate-[-45deg] group-hover:scale-110">
                  <ArrowIcon />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
