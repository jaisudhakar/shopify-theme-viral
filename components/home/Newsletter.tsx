"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ArrowIcon } from "../Icons";

export function Newsletter() {
  const [done, setDone] = useState(false);
  return (
    <section className="mx-auto max-w-[1440px] px-4 sm:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-volt px-6 py-16 text-center sm:px-16 sm:py-24">
        <motion.div
          aria-hidden
          className="absolute -left-20 -top-20 size-72 rounded-full bg-white/40 blur-2xl"
          animate={{ x: [0, 80, 0], y: [0, 40, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <h2 className="relative font-display text-[clamp(2.5rem,6vw,5rem)] uppercase leading-none">Become a member</h2>
        <p className="relative mx-auto mt-4 max-w-lg text-lg">
          Sign up for first access to drops, member-only offers and free delivery on every order.
        </p>
        <AnimatePresence mode="wait">
          {done ? (
            <motion.p
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative mt-8 text-xl font-semibold"
            >
              You&apos;re in. Watch your inbox 👟
            </motion.p>
          ) : (
            <motion.form
              key="form"
              exit={{ opacity: 0, y: -10 }}
              onSubmit={(e) => {
                e.preventDefault();
                setDone(true);
              }}
              className="relative mx-auto mt-8 flex max-w-md gap-2 rounded-full bg-paper p-1.5"
            >
              <input
                type="email"
                required
                placeholder="Email address"
                className="min-w-0 flex-1 bg-transparent px-4 outline-none"
              />
              <button className="group flex items-center gap-2 rounded-full bg-ink px-5 py-3 font-medium text-paper">
                Join <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
