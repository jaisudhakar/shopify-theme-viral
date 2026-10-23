import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Suspense } from "react";
import { categories, getProducts } from "@/lib/catalog";
import { CollectionView } from "@/components/CollectionView";

export function generateStaticParams() {
  return categories.map((c) => ({ handle: c.handle }));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  return { title: categories.find((c) => c.handle === handle)?.title ?? "Shop" };
}

export default async function CollectionPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const category = categories.find((c) => c.handle === handle);
  if (!category) notFound();

  const all = await getProducts();
  const products = handle === "all" ? all : all.filter((p) => p.category === handle);

  return (
    <Suspense>
      <CollectionView title={category.title} blurb={category.blurb} products={products} />
    </Suspense>
  );
}
