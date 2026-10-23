export type Category = "men" | "women" | "kids";

export type Colorway = {
  name: string;
  /** Main upper colour. */
  base: string;
  /** Stripe / detail colour. */
  accent: string;
  /** Sole colour. */
  sole: string;
  /** Background tint used behind the product. */
  bg: string;
};

export type Variant = {
  id: string;
  available: boolean;
  options: Record<string, string>;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  subtitle: string;
  category: Category;
  price: number;
  compareAtPrice?: number;
  currency: string;
  badge?: "New" | "Bestseller" | "Sale" | "Limited";
  description: string;
  colors: Colorway[];
  sizes: string[];
  /** Real product photos (Shopify). When empty the SVG artwork is drawn. */
  images: string[];
  /** Shopify variants, used to build a real checkout. */
  variants: Variant[];
};

export type CartLine = {
  key: string;
  handle: string;
  title: string;
  subtitle: string;
  price: number;
  currency: string;
  color: Colorway;
  size: string;
  image?: string;
  variantId?: string;
  quantity: number;
};
