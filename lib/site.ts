import type { Category } from "./types";

export const site = {
  name: "NIKE",
  tagline: "Move Without Limits",
  description:
    "Performance footwear and apparel built for every stride. New drops every week.",
  announcements: [
    "Free delivery on orders over $50",
    "New drops every Friday — be first in line",
    "Members get free 30-day returns",
  ],
  /** Animated counters on the home page — edit to match your store's policies. */
  stats: [
    { value: 50, prefix: "$", suffix: "", label: "Free delivery threshold" },
    { value: 30, prefix: "", suffix: "-day", label: "Free returns" },
    { value: 24, prefix: "", suffix: "/7", label: "Customer support" },
    { value: 100, prefix: "", suffix: "%", label: "Secure checkout" },
  ],
  nav: [
    { label: "New & Featured", href: "/collections/all?sort=new" },
    { label: "Men", href: "/collections/men" },
    { label: "Women", href: "/collections/women" },
    { label: "Kids", href: "/collections/kids" },
    { label: "Sale", href: "/collections/all?sale=1" },
  ],
};

export const categories: { handle: Category | "all"; title: string; blurb: string }[] = [
  { handle: "all", title: "All Products", blurb: "Every drop, every colourway." },
  { handle: "men", title: "Men", blurb: "Run, train and lounge in the latest gear." },
  { handle: "women", title: "Women", blurb: "Built for speed, styled for every day." },
  { handle: "kids", title: "Kids", blurb: "Made to keep up with the fastest feet." },
];
