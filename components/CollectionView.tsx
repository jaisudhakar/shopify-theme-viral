"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { categories } from "@/lib/site";
import { cx } from "@/lib/format";
import { ProductCard } from "./ProductCard";
import { ChevronIcon } from "./Icons";

const sorts = [
  { value: "featured", label: "Featured" },
  { value: "new", label: "Newest" },
  { value: "price-asc", label: "Price: Low–High" },
  { value: "price-desc", label: "Price: High–Low" },
];

const priceRanges = [
  { value: "0-75", label: "Under $75", min: 0, max: 75 },
  { value: "75-150", label: "$75 – $150", min: 75, max: 150 },
  { value: "150-9999", label: "Over $150", min: 150, max: Infinity },
];

export function CollectionView({ title, blurb, products }: { title: string; blurb: string; products: Product[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [showFilters, setShowFilters] = useState(true);
  const [sortOpen, setSortOpen] = useState(false);

  const q = params.get("q") ?? "";
  const sort = params.get("sort") ?? "featured";
  const sale = params.get("sale") === "1";
  const price = params.get("price");

  function update(key: string, value: string | null) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`${pathname}?${next}`, { scroll: false });
  }

  const visible = useMemo(() => {
    let list = products.filter((p) => {
      if (q && !`${p.title} ${p.subtitle} ${p.description}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (sale && !p.compareAtPrice) return false;
      const range = priceRanges.find((r) => r.value === price);
      if (range && (p.price < range.min || p.price >= range.max)) return false;
      return true;
    });
    if (sort === "new") list = [...list].sort((a, b) => Number(b.badge === "New") - Number(a.badge === "New"));
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, q, sale, price, sort]);

  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
      <div className="sticky top-0 z-30 -mx-4 flex flex-wrap items-end justify-between gap-4 bg-paper/90 px-4 py-6 backdrop-blur sm:-mx-8 sm:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-medium">
            {q ? `Results for “${q}”` : title} <span className="text-muted">({visible.length})</span>
          </h1>
          <p className="text-sm text-muted">{blurb}</p>
        </motion.div>
        <div className="flex items-center gap-6">
          <button onClick={() => setShowFilters((s) => !s)} className="hidden font-medium md:block">
            {showFilters ? "Hide" : "Show"} Filters
          </button>
          <div className="relative">
            <button onClick={() => setSortOpen((s) => !s)} className="flex items-center gap-1 font-medium">
              Sort By: <span className="text-muted">{sorts.find((s) => s.value === sort)?.label}</span>
              <ChevronIcon className={cx("size-4 transition-transform", sortOpen && "rotate-180")} />
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 top-9 z-10 w-48 rounded-xl bg-paper p-2 text-right shadow-xl ring-1 ring-line"
                >
                  {sorts.map((s) => (
                    <li key={s.value}>
                      <button
                        onClick={() => {
                          update("sort", s.value === "featured" ? null : s.value);
                          setSortOpen(false);
                        }}
                        className="w-full rounded-lg px-3 py-2 text-right hover:bg-mist"
                      >
                        {s.label}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        <AnimatePresence initial={false}>
          {showFilters && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="hidden shrink-0 overflow-clip md:block"
            >
              <div className="sticky top-28 w-60 space-y-8 pb-10">
                <nav className="space-y-2 text-[15px] font-medium">
                  {categories.map((c) => (
                    <Link
                      key={c.handle}
                      href={`/collections/${c.handle}`}
                      className={cx("block transition-colors", pathname.endsWith(`/${c.handle}`) ? "text-ink" : "text-muted hover:text-ink")}
                    >
                      {c.title}
                    </Link>
                  ))}
                </nav>
                <div className="border-t border-line pt-5">
                  <h3 className="mb-3 font-medium">Shop by price</h3>
                  {priceRanges.map((r) => (
                    <label key={r.value} className="flex cursor-pointer items-center gap-3 py-1.5">
                      <input
                        type="checkbox"
                        checked={price === r.value}
                        onChange={() => update("price", price === r.value ? null : r.value)}
                        className="size-4 accent-ink"
                      />
                      {r.label}
                    </label>
                  ))}
                </div>
                <div className="border-t border-line pt-5">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input type="checkbox" checked={sale} onChange={() => update("sale", sale ? null : "1")} className="size-4 accent-ink" />
                    Sale & offers
                  </label>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <div className="flex-1">
          <div className="mb-6 flex gap-2 overflow-x-auto no-scrollbar md:hidden">
            {categories.map((c) => (
              <Link
                key={c.handle}
                href={`/collections/${c.handle}`}
                className={cx(
                  "shrink-0 rounded-full border px-4 py-2 text-sm",
                  pathname.endsWith(`/${c.handle}`) ? "border-ink bg-ink text-paper" : "border-line",
                )}
              >
                {c.title}
              </Link>
            ))}
          </div>

          <motion.div layout className={cx("grid grid-cols-2 gap-x-4 gap-y-12", showFilters ? "lg:grid-cols-3" : "lg:grid-cols-4")}>
            <AnimatePresence mode="popLayout">
              {visible.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.92, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.45, delay: Math.min(i, 8) * 0.04, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {visible.length === 0 && (
            <div className="py-24 text-center">
              <p className="text-xl">No products match your filters.</p>
              <Link href={pathname} className="mt-4 inline-block underline">
                Clear filters
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
