"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/format";
import { useCart } from "./CartProvider";
import { CloseIcon, MinusIcon, PlusIcon } from "./Icons";
import { ShoeArt } from "./ShoeArt";

const FREE_SHIPPING = 50;

export function CartDrawer() {
  const { lines, open, setOpen, subtotal, setQuantity, remove, count } = useCart();
  const [status, setStatus] = useState<{ loading: boolean; error?: string }>({ loading: false });
  const currency = lines[0]?.currency ?? "USD";
  const progress = Math.min(subtotal / FREE_SHIPPING, 1);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  async function checkout() {
    setStatus({ loading: true });
    const missing = lines.some((l) => !l.variantId);
    if (missing) {
      setStatus({ loading: false, error: "Demo products can't be checked out. Connect Shopify to enable checkout." });
      return;
    }
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lines: lines.map((l) => ({ merchandiseId: l.variantId, quantity: l.quantity })) }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setStatus({ loading: false, error: data.error });
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-label="Shopping bag"
            className="fixed inset-y-0 right-0 z-50 flex w-[min(440px,100vw)] flex-col bg-paper"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 300 }}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 className="text-xl font-medium">Bag {count > 0 && <span className="text-muted">({count})</span>}</h2>
              <button onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-mist" aria-label="Close bag">
                <CloseIcon />
              </button>
            </div>

            {lines.length > 0 && (
              <div className="border-b border-line px-6 py-4 text-sm">
                <p>
                  {progress >= 1
                    ? "You've unlocked free delivery 🎉"
                    : `Add ${formatPrice(FREE_SHIPPING - subtotal, currency)} more for free delivery`}
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-mist">
                  <motion.div
                    className="h-full rounded-full bg-ink"
                    initial={false}
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ type: "spring", damping: 20 }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <p className="text-lg">There are no items in your bag.</p>
                  <Link
                    href="/collections/all"
                    onClick={() => setOpen(false)}
                    className="rounded-full bg-ink px-6 py-3 font-medium text-paper transition-transform hover:scale-105"
                  >
                    Shop new arrivals
                  </Link>
                </div>
              ) : (
                <ul>
                  <AnimatePresence initial={false}>
                    {lines.map((line) => (
                      <motion.li
                        key={line.key}
                        layout
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 80, height: 0, paddingTop: 0, paddingBottom: 0 }}
                        className="flex gap-4 overflow-hidden border-b border-line py-5"
                      >
                        <Link
                          href={`/products/${line.handle}`}
                          onClick={() => setOpen(false)}
                          className="relative grid size-24 shrink-0 place-items-center overflow-hidden rounded-lg"
                          style={{ background: line.color.bg }}
                        >
                          {line.image ? (
                            <Image src={line.image} alt={line.title} fill sizes="96px" className="object-cover" />
                          ) : (
                            <ShoeArt color={line.color} className="w-[90%] -rotate-6" />
                          )}
                        </Link>
                        <div className="flex flex-1 flex-col">
                          <div className="flex justify-between gap-2">
                            <p className="font-medium">{line.title}</p>
                            <p className="font-medium">{formatPrice(line.price * line.quantity, line.currency)}</p>
                          </div>
                          <p className="text-sm text-muted">{line.subtitle}</p>
                          <p className="text-sm text-muted">
                            {line.color.name} · Size {line.size}
                          </p>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex items-center rounded-full border border-line">
                              <button
                                onClick={() => setQuantity(line.key, line.quantity - 1)}
                                className="p-2"
                                aria-label="Decrease quantity"
                              >
                                <MinusIcon />
                              </button>
                              <span className="w-6 text-center text-sm">{line.quantity}</span>
                              <button
                                onClick={() => setQuantity(line.key, line.quantity + 1)}
                                className="p-2"
                                aria-label="Increase quantity"
                              >
                                <PlusIcon />
                              </button>
                            </div>
                            <button onClick={() => remove(line.key)} className="text-sm text-muted underline hover:text-ink">
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-line px-6 py-5">
                <div className="flex justify-between text-lg font-medium">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal, currency)}</span>
                </div>
                <p className="mt-1 text-sm text-muted">Shipping and taxes calculated at checkout.</p>
                {status.error && <p className="mt-3 text-sm text-red-600">{status.error}</p>}
                <button
                  onClick={checkout}
                  disabled={status.loading}
                  className="mt-4 w-full rounded-full bg-ink py-4 font-medium text-paper transition hover:bg-ink/80 disabled:opacity-60"
                >
                  {status.loading ? "Redirecting…" : "Checkout"}
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
