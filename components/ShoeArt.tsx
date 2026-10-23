"use client";

import { useId } from "react";
import type { Colorway } from "@/lib/types";

/** Vector sneaker drawn in the product's colourway. Used when a product has no photos. */
export function ShoeArt({ color, className }: { color: Colorway; className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 400 220" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`shade-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.35" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.16" />
        </linearGradient>
        <linearGradient id={`shine-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id={`shadow-${id}`} x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#000" floodOpacity="0.18" />
        </filter>
      </defs>

      <ellipse cx="205" cy="205" rx="165" ry="9" fill="#000" opacity="0.12" />

      <g filter={`url(#shadow-${id})`}>
        {/* outsole */}
        <path d="M26 158 Q24 192 66 192 L352 192 Q390 192 388 164 L386 156 Z" fill="#1b1b1b" opacity="0.9" />
        {/* midsole */}
        <path d="M28 150 Q26 184 66 184 L350 184 Q386 184 386 158 L384 146 Z" fill={color.sole} />
        <path d="M60 158 h70 a8 8 0 0 1 8 8 v4 a8 8 0 0 1 -8 8 h-70 a8 8 0 0 1 -8 -8 v-4 a8 8 0 0 1 8 -8z" fill={color.accent} opacity="0.35" />
        {/* upper */}
        <path d="M34 152 L42 80 Q45 60 64 63 L100 70 Q120 94 146 76 L162 46 Q170 34 184 41 L236 78 Q296 104 348 116 Q388 126 386 152 Z" fill={color.base} />
        <path d="M34 152 L42 80 Q45 60 64 63 L100 70 Q120 94 146 76 L162 46 Q170 34 184 41 L236 78 Q296 104 348 116 Q388 126 386 152 Z" fill={`url(#shade-${id})`} />
        {/* toe cap & heel counter */}
        <path d="M300 112 Q350 116 372 128 Q388 138 386 152 L318 152 Q300 134 300 112 Z" fill="#000" opacity="0.08" />
        <path d="M34 152 L40 92 Q60 98 74 120 Q80 138 78 152 Z" fill="#000" opacity="0.1" />
        {/* side stripe */}
        <path d="M86 140 Q190 112 338 126 Q248 96 156 110 Q108 118 86 140 Z" fill={color.accent} />
        {/* eyestay & laces */}
        <path d="M162 50 L238 90" stroke="#000" strokeOpacity="0.18" strokeWidth="14" strokeLinecap="round" />
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1={168 + i * 15}
            y1={50 + i * 8}
            x2={180 + i * 15}
            y2={44 + i * 8}
            stroke={color.sole}
            strokeWidth="4"
            strokeLinecap="round"
          />
        ))}
        {/* heel tab */}
        <path d="M42 80 Q44 62 62 63 L60 92 Q50 92 41 90 Z" fill={color.accent} opacity="0.9" />
        {/* stitching */}
        <path d="M48 146 L52 96" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="4 4" />
        {/* shine */}
        <path
          d="M34 152 L42 80 Q45 60 64 63 L100 70 Q120 94 146 76 L162 46 Q170 34 184 41 L236 78 Q296 104 348 116 Q388 126 386 152 Z"
          fill={`url(#shine-${id})`}
        />
      </g>
    </svg>
  );
}
