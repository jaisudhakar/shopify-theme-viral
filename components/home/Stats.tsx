"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";

function Counter({ value, prefix, suffix }: { value: number; prefix: string; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, { duration: 1.8, ease: [0.22, 1, 0.36, 1], onUpdate: setDisplay });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref}>
      {prefix}
      {Math.round(display)}
      {suffix}
    </span>
  );
}

export function Stats() {
  return (
    <section className="mx-auto grid max-w-[1440px] grid-cols-2 gap-px overflow-hidden border-y border-line bg-line lg:grid-cols-4">
      {site.stats.map((s) => (
        <div key={s.label} className="bg-paper px-6 py-12 text-center">
          <p className="font-display text-[clamp(3rem,6vw,5rem)] leading-none">
            <Counter {...s} />
          </p>
          <p className="mt-3 text-muted">{s.label}</p>
        </div>
      ))}
    </section>
  );
}
