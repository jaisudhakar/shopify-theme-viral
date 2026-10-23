import Link from "next/link";
import { getProducts } from "@/lib/catalog";
import { Hero } from "@/components/home/Hero";
import { HorizontalShowcase } from "@/components/home/HorizontalShowcase";
import { ScrollText } from "@/components/home/ScrollText";
import { CategoryTiles } from "@/components/home/CategoryTiles";
import { Spotlight } from "@/components/home/Spotlight";
import { Stats } from "@/components/home/Stats";
import { Newsletter } from "@/components/home/Newsletter";
import { Marquee } from "@/components/Marquee";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { ArrowIcon } from "@/components/Icons";

export default async function Home() {
  const products = await getProducts();
  const hero = products.find((p) => p.colors.length >= 3) ?? products[0];
  const newArrivals = [...new Set([...products.filter((p) => p.badge === "New" || p.badge === "Limited"), ...products])].slice(0, 4);
  const trending = products.slice(0, 8);
  const spotlight = products.find((p) => p.badge === "Limited") ?? products[1] ?? products[0];
  const pick = (cat: string) => products.find((p) => p.category === cat) ?? products[0];

  return (
    <>
      <Hero product={hero} />

      <Marquee
        className="bg-ink py-5 font-display text-3xl uppercase text-paper sm:text-4xl"
        items={["New drops every Friday", "Free delivery over $50", "Members get early access", "30-day free returns"]}
      />

      <section className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8">
        <Reveal className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-muted">Fresh off the line</p>
            <h2 className="mt-1 font-display text-[clamp(2.5rem,5vw,4.5rem)] uppercase leading-none">New arrivals</h2>
          </div>
          <Link href="/collections/all?sort=new" className="group flex items-center gap-2 font-medium">
            Shop all <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {newArrivals.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      <CategoryTiles
        tiles={[
          { title: "Men", href: "/collections/men", product: pick("men"), tone: "#1f1f1f" },
          { title: "Women", href: "/collections/women", product: pick("women"), tone: "#e0655c" },
          { title: "Kids", href: "/collections/kids", product: pick("kids"), tone: "#3b6fe0" },
        ]}
      />

      <ScrollText text="Every stride is a statement. We design for the runner chasing a personal best, the player owning the court, and everyone who simply refuses to stand still." />

      <HorizontalShowcase title="Trending now" products={trending} />

      <div className="py-20">
        <Stats />
      </div>

      <Spotlight product={spotlight} />

      <Marquee
        reverse
        duration={40}
        className="my-20 font-display text-[clamp(3rem,9vw,8rem)] uppercase leading-none text-transparent [-webkit-text-stroke:1.5px_var(--color-ink)]"
        items={["Run", "Train", "Play", "Repeat"]}
      />

      <Newsletter />
    </>
  );
}
