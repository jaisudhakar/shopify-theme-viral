"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { useCart } from "./CartProvider";
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon } from "./Icons";

export function Header() {
  const { count, setOpen } = useCart();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 160);
    setScrolled(y > 10);
  });

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        animate={{ y: hidden && !menuOpen ? "-100%" : "0%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`sticky top-0 z-40 bg-paper/90 backdrop-blur-md transition-shadow ${scrolled ? "shadow-[0_1px_0_var(--color-line)]" : ""}`}
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-8">
          <Link href="/" className="font-display text-3xl tracking-tight" aria-label={`${site.name} home`}>
            {site.name}
          </Link>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 gap-7 text-[15px] font-medium lg:flex">
            {site.nav.map((item) => (
              <Link key={item.label} href={item.href} className="group relative py-2">
                {item.label}
                <span className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 bg-ink transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-full p-2 transition-colors hover:bg-mist sm:bg-mist sm:pl-2.5 sm:pr-5"
              aria-label="Search"
            >
              <SearchIcon />
              <span className="hidden text-[15px] text-muted sm:inline">Search</span>
            </button>
            <button className="hidden rounded-full p-2 transition-colors hover:bg-mist sm:block" aria-label="Favourites">
              <HeartIcon />
            </button>
            <button
              onClick={() => setOpen(true)}
              className="relative rounded-full p-2 transition-colors hover:bg-mist"
              aria-label={`Bag, ${count} items`}
            >
              <BagIcon />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: [1.4, 1], opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute right-0.5 top-0.5 grid size-[18px] place-items-center rounded-full bg-ink text-[10px] font-bold text-paper"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button onClick={() => setMenuOpen(true)} className="rounded-full p-2 hover:bg-mist lg:hidden" aria-label="Menu">
              <MenuIcon />
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-50 flex w-[min(360px,85vw)] flex-col bg-paper p-6 lg:hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <button onClick={onClose} className="self-end rounded-full p-2 hover:bg-mist" aria-label="Close menu">
              <CloseIcon />
            </button>
            <nav className="mt-6 flex flex-col gap-1">
              {site.nav.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.08 + i * 0.05 }}
                >
                  <Link href={item.href} className="block py-2 text-2xl font-medium">
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <p className="mt-auto text-sm text-muted">
              Become a member for the best products, inspiration and stories in sport.
            </p>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-x-0 top-0 z-50 bg-paper px-4 pb-10 pt-6 sm:px-8"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
          >
            <form
              className="mx-auto flex max-w-3xl items-center gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                const q = input.current?.value.trim();
                router.push(q ? `/collections/all?q=${encodeURIComponent(q)}` : "/collections/all");
              }}
            >
              <div className="flex flex-1 items-center gap-3 rounded-full bg-mist px-4 py-3">
                <SearchIcon />
                <input ref={input} name="q" placeholder="Search products" className="w-full bg-transparent text-lg outline-none" />
              </div>
              <button type="button" onClick={onClose} className="font-medium">
                Cancel
              </button>
            </form>
            <div className="mx-auto mt-6 flex max-w-3xl flex-wrap gap-2 text-sm">
              <span className="py-1.5 text-muted">Popular:</span>
              {["Runner", "Court", "Trail", "Zoom"].map((term) => (
                <Link
                  key={term}
                  href={`/collections/all?q=${term}`}
                  className="rounded-full border border-line px-3 py-1.5 transition-colors hover:border-ink"
                >
                  {term}
                </Link>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
