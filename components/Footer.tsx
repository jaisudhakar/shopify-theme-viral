import Link from "next/link";
import { site } from "@/lib/site";

const columns = [
  { title: "Resources", links: ["Find A Store", "Become A Member", "Send Us Feedback", "Gift Cards"] },
  { title: "Help", links: ["Order Status", "Shipping & Delivery", "Returns", "Payment Options", "Contact Us"] },
  { title: "Company", links: ["About", "News", "Careers", "Sustainability"] },
];

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-paper">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-16 sm:px-8 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div>
          <Link href="/" className="font-display text-5xl">
            {site.name}
          </Link>
          <p className="mt-4 max-w-xs text-sm text-white/60">{site.description}</p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="font-medium">{col.title}</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/60">
              {col.links.map((l) => (
                <li key={l}>
                  <a href="#" className="transition-colors hover:text-paper">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 border-t border-white/10 px-4 py-6 text-xs text-white/50 sm:flex-row sm:justify-between sm:px-8">
        <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
        <div className="flex gap-5">
          <a href="#" className="hover:text-paper">Terms of Sale</a>
          <a href="#" className="hover:text-paper">Terms of Use</a>
          <a href="#" className="hover:text-paper">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}
