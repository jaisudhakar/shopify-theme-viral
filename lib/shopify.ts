import type { Category, Colorway, Product } from "./types";

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const version = process.env.SHOPIFY_API_VERSION || "2025-10";

export const shopifyEnabled = Boolean(domain && token);

async function storefront<T>(query: string, variables: Record<string, unknown> = {}, revalidate = 300): Promise<T> {
  const res = await fetch(`https://${domain}/api/${version}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token!,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate },
  });
  const json = await res.json();
  if (!res.ok || json.errors) {
    throw new Error(`Shopify Storefront API error: ${JSON.stringify(json.errors ?? res.status)}`);
  }
  return json.data as T;
}

const PRODUCT_FIELDS = `
  id
  handle
  title
  description
  productType
  tags
  priceRange { minVariantPrice { amount currencyCode } }
  compareAtPriceRange { maxVariantPrice { amount } }
  images(first: 10) { nodes { url } }
  options { name optionValues { name swatch { color } } }
  variants(first: 100) {
    nodes { id availableForSale selectedOptions { name value } }
  }
`;

type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  productType: string;
  tags: string[];
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  compareAtPriceRange: { maxVariantPrice: { amount: string } };
  images: { nodes: { url: string }[] };
  options: { name: string; optionValues: { name: string; swatch: { color: string | null } | null }[] }[];
  variants: {
    nodes: { id: string; availableForSale: boolean; selectedOptions: { name: string; value: string }[] }[];
  };
};

const fallbackSwatches = ["#111111", "#e3262f", "#1f6feb", "#d4ff3f", "#f3ead8", "#ff5a1f"];

function tint(hex: string, amount = 0.85) {
  const n = parseInt(hex.replace("#", "").padEnd(6, "0").slice(0, 6), 16);
  const mix = (v: number) => Math.round(v + (255 - v) * amount);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(mix);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

function categoryOf(p: ShopifyProduct): Category {
  const haystack = [p.productType, ...p.tags, p.title].join(" ").toLowerCase();
  if (/\b(kid|kids|youth|junior|boys|girls)\b/.test(haystack)) return "kids";
  if (/\b(women|womens|women's|female|ladies)\b/.test(haystack)) return "women";
  return "men";
}

function mapProduct(p: ShopifyProduct): Product {
  const option = (re: RegExp) => p.options.find((o) => re.test(o.name));
  const colorOpt = option(/colou?r/i);
  const sizeOpt = option(/size/i);

  const colors: Colorway[] = (colorOpt?.optionValues ?? [{ name: "Default", swatch: null }]).map((v, i) => {
    const swatch = v.swatch?.color || fallbackSwatches[i % fallbackSwatches.length];
    return { name: v.name, base: swatch, accent: "#ffffff", sole: "#ffffff", bg: tint(swatch) };
  });

  const price = Number(p.priceRange.minVariantPrice.amount);
  const compare = Number(p.compareAtPriceRange.maxVariantPrice.amount);
  const tags = p.tags.map((t) => t.toLowerCase());

  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    subtitle: p.productType || "Shoes",
    category: categoryOf(p),
    price,
    compareAtPrice: compare > price ? compare : undefined,
    currency: p.priceRange.minVariantPrice.currencyCode,
    badge: compare > price ? "Sale" : tags.includes("new") ? "New" : tags.includes("bestseller") ? "Bestseller" : undefined,
    description: p.description,
    colors,
    sizes: sizeOpt?.optionValues.map((v) => v.name) ?? ["One Size"],
    images: p.images.nodes.map((n) => n.url),
    variants: p.variants.nodes.map((v) => ({
      id: v.id,
      available: v.availableForSale,
      options: Object.fromEntries(v.selectedOptions.map((o) => [o.name, o.value])),
    })),
  };
}

export async function fetchShopifyProducts(): Promise<Product[]> {
  const data = await storefront<{ products: { nodes: ShopifyProduct[] } }>(
    `query Products { products(first: 100, sortKey: CREATED_AT, reverse: true) { nodes { ${PRODUCT_FIELDS} } } }`,
  );
  return data.products.nodes.map(mapProduct);
}

export async function fetchShopifyProduct(handle: string): Promise<Product | undefined> {
  const data = await storefront<{ product: ShopifyProduct | null }>(
    `query Product($handle: String!) { product(handle: $handle) { ${PRODUCT_FIELDS} } }`,
    { handle },
  );
  return data.product ? mapProduct(data.product) : undefined;
}

export async function createCheckout(lines: { merchandiseId: string; quantity: number }[]) {
  const data = await storefront<{
    cartCreate: { cart: { checkoutUrl: string } | null; userErrors: { message: string }[] };
  }>(
    `mutation CartCreate($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) { cart { checkoutUrl } userErrors { message } }
    }`,
    { lines },
    0,
  );
  if (!data.cartCreate.cart) throw new Error(data.cartCreate.userErrors.map((e) => e.message).join(", "));
  return data.cartCreate.cart.checkoutUrl;
}
