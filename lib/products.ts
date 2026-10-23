import type { Colorway, Product } from "./types";

// Placeholder catalog shown until the Storefront API is connected
// (see .env.example). Replace or extend freely.

const c = (name: string, base: string, accent: string, sole: string, bg: string): Colorway => ({
  name,
  base,
  accent,
  sole,
  bg,
});

const adultSizes = ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "12"];
const kidSizes = ["1Y", "1.5Y", "2Y", "2.5Y", "3Y", "3.5Y", "4Y", "5Y", "6Y"];

const base: Pick<Product, "currency" | "images" | "variants"> = { currency: "USD", images: [], variants: [] };

export const placeholderProducts: Product[] = [
  {
    ...base,
    id: "p1",
    handle: "velocity-runner",
    title: "Velocity Runner",
    subtitle: "Men's Road Running Shoes",
    category: "men",
    price: 160,
    badge: "New",
    description:
      "A springy foam stack and a breathable engineered mesh upper keep you light on long runs. The rocker geometry rolls you forward stride after stride.",
    colors: [
      c("Volt Rush", "#d4ff3f", "#111111", "#ffffff", "#eef7c8"),
      c("Black Ice", "#1a1a1a", "#ff4d2e", "#f2f2f2", "#e5e5e5"),
      c("Ocean", "#1f6feb", "#ffffff", "#f5f5f5", "#d9e7ff"),
    ],
    sizes: adultSizes,
  },
  {
    ...base,
    id: "p2",
    handle: "air-glide-90",
    title: "Air Glide 90",
    subtitle: "Women's Shoes",
    category: "women",
    price: 140,
    badge: "Bestseller",
    description:
      "A retro silhouette with a visible cushioning window in the heel. Soft suede overlays and a padded collar make it an all-day favourite.",
    colors: [
      c("Rose Quartz", "#f7b6c8", "#ffffff", "#fff8f0", "#fde7ee"),
      c("Sail", "#f3ead8", "#c2553a", "#ffffff", "#f6efe3"),
      c("Lilac", "#b9a7f5", "#222222", "#ffffff", "#ece7fd"),
    ],
    sizes: adultSizes,
  },
  {
    ...base,
    id: "p3",
    handle: "court-legacy-low",
    title: "Court Legacy Low",
    subtitle: "Men's Shoes",
    category: "men",
    price: 115,
    description:
      "Clean leather, a cupsole built for the court and a low profile that goes with everything. Classic since day one.",
    colors: [
      c("Triple White", "#fafafa", "#d8d8d8", "#ffffff", "#ececec"),
      c("University Red", "#e3262f", "#ffffff", "#ffffff", "#fde0e0"),
      c("Forest", "#1f5135", "#f4e8c8", "#f4e8c8", "#dcebe1"),
    ],
    sizes: adultSizes,
  },
  {
    ...base,
    id: "p4",
    handle: "trail-pegasus-x",
    title: "Trail Pegasus X",
    subtitle: "Men's Trail Running Shoes",
    category: "men",
    price: 150,
    compareAtPrice: 180,
    badge: "Sale",
    description:
      "Grippy lugs, a rock plate and a water-resistant upper for when the pavement ends. Built to handle mud, scree and everything between.",
    colors: [
      c("Canyon", "#c4622d", "#2b2b2b", "#3a3a3a", "#f6e2d6"),
      c("Moss", "#5e7a3a", "#f2c94c", "#2b2b2b", "#e5ecd9"),
    ],
    sizes: adultSizes,
  },
  {
    ...base,
    id: "p5",
    handle: "flex-dash-kids",
    title: "Flex Dash",
    subtitle: "Big Kids' Shoes",
    category: "kids",
    price: 70,
    badge: "New",
    description:
      "Easy on, easy off. A stretchy upper and a flexible sole made for recess sprints and weekend adventures.",
    colors: [
      c("Laser Blue", "#2aa7ff", "#ffe600", "#ffffff", "#dcf1ff"),
      c("Hyper Pink", "#ff4fa3", "#ffffff", "#ffffff", "#ffe0ef"),
    ],
    sizes: kidSizes,
  },
  {
    ...base,
    id: "p6",
    handle: "zoom-fly-pro",
    title: "Zoom Fly Pro",
    subtitle: "Women's Racing Shoes",
    category: "women",
    price: 250,
    badge: "Limited",
    description:
      "A full-length carbon plate sandwiched in our most responsive foam. Engineered for race day and personal bests.",
    colors: [
      c("Solar Flare", "#ff5a1f", "#fff200", "#ffffff", "#ffe4d6"),
      c("Electric Mint", "#33e0b0", "#0b0b0b", "#ffffff", "#d8f8ee"),
    ],
    sizes: adultSizes,
  },
  {
    ...base,
    id: "p7",
    handle: "dunk-street",
    title: "Dunk Street",
    subtitle: "Men's Shoes",
    category: "men",
    price: 120,
    badge: "Bestseller",
    description:
      "Born on the hardwood, adopted by the streets. Colour-blocked leather overlays and a padded low-cut collar.",
    colors: [
      c("Panda", "#111111", "#ffffff", "#ffffff", "#e8e8e8"),
      c("Syracuse", "#ff7a00", "#ffffff", "#ffffff", "#ffe9d4"),
      c("Kentucky", "#1450a3", "#ffffff", "#ffffff", "#dde8f8"),
    ],
    sizes: adultSizes,
  },
  {
    ...base,
    id: "p8",
    handle: "cloud-walk",
    title: "Cloud Walk",
    subtitle: "Women's Lifestyle Shoes",
    category: "women",
    price: 110,
    compareAtPrice: 130,
    badge: "Sale",
    description:
      "Plush, pillowy cushioning and a knit upper that hugs your foot. Made for city miles and long days on your feet.",
    colors: [
      c("Cream", "#f2e6cf", "#8c6d4f", "#ffffff", "#f7f0e3"),
      c("Sky", "#9fd3ff", "#ffffff", "#ffffff", "#e3f2ff"),
    ],
    sizes: adultSizes,
  },
  {
    ...base,
    id: "p9",
    handle: "jumpman-mid",
    title: "Jumpman Mid",
    subtitle: "Big Kids' Basketball Shoes",
    category: "kids",
    price: 95,
    description:
      "Mid-top support for young hoopers, with a grippy herringbone outsole and soft foam underfoot.",
    colors: [
      c("Chicago", "#d2102b", "#111111", "#ffffff", "#fbdde1"),
      c("Royal", "#1b3fa0", "#111111", "#ffffff", "#dde4f8"),
    ],
    sizes: kidSizes,
  },
  {
    ...base,
    id: "p10",
    handle: "metcon-train",
    title: "Metcon Train",
    subtitle: "Men's Training Shoes",
    category: "men",
    price: 130,
    description:
      "A wide, stable heel for heavy lifts and a flexible forefoot for sprints and box jumps. One shoe for the whole workout.",
    colors: [
      c("Stealth", "#2e2e2e", "#9a9a9a", "#1c1c1c", "#e3e3e3"),
      c("Bright Crimson", "#ff2d55", "#111111", "#111111", "#ffe0e6"),
    ],
    sizes: adultSizes,
  },
  {
    ...base,
    id: "p11",
    handle: "vapor-sprint",
    title: "Vapor Sprint",
    subtitle: "Women's Track Spikes",
    category: "women",
    price: 180,
    badge: "New",
    description:
      "An aggressive spike plate and a featherweight upper for the 100 to 400. Pure speed, nothing else.",
    colors: [
      c("Volt", "#e2ff00", "#ff4500", "#111111", "#f3fbc4"),
      c("Violet", "#7b3fe4", "#00f0ff", "#ffffff", "#e9defc"),
    ],
    sizes: adultSizes,
  },
  {
    ...base,
    id: "p12",
    handle: "little-runner",
    title: "Little Runner",
    subtitle: "Little Kids' Shoes",
    category: "kids",
    price: 55,
    description:
      "Hook-and-loop straps and a cushy sole for little feet that never stop moving.",
    colors: [
      c("Sunny", "#ffd23f", "#2a6df4", "#ffffff", "#fff4cf"),
      c("Mint", "#7de2c3", "#ff6b6b", "#ffffff", "#e0f8f0"),
    ],
    sizes: kidSizes,
  },
];
