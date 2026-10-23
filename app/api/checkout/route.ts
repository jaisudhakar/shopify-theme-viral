import { NextResponse } from "next/server";
import { createCheckout, shopifyEnabled } from "@/lib/shopify";

export async function POST(req: Request) {
  if (!shopifyEnabled) {
    return NextResponse.json({ error: "Shopify is not connected yet. Add your Storefront API token to .env.local." }, { status: 400 });
  }
  const { lines } = (await req.json()) as { lines: { merchandiseId: string; quantity: number }[] };
  if (!lines?.length) return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });
  try {
    return NextResponse.json({ url: await createCheckout(lines) });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
