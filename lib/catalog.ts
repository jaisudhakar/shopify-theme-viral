import { placeholderProducts } from "./products";
import { fetchShopifyProduct, fetchShopifyProducts, shopifyEnabled } from "./shopify";
import type { Product } from "./types";

export async function getProducts(): Promise<Product[]> {
  if (!shopifyEnabled) return placeholderProducts;
  try {
    const products = await fetchShopifyProducts();
    return products.length ? products : placeholderProducts;
  } catch (err) {
    console.error(err);
    return placeholderProducts;
  }
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  if (shopifyEnabled) {
    try {
      const product = await fetchShopifyProduct(handle);
      if (product) return product;
    } catch (err) {
      console.error(err);
    }
  }
  return placeholderProducts.find((p) => p.handle === handle);
}

export { categories } from "./site";
