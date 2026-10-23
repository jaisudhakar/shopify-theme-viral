"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

export function AnnouncementBar() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % site.announcements.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative h-9 overflow-hidden bg-mist text-center text-[13px] font-medium">
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={i}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center px-4"
        >
          {site.announcements[i]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
