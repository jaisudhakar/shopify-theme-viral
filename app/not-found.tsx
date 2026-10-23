import Link from "next/link";

export default function NotFound() {
  return (
    <section className="grid min-h-[60vh] place-items-center px-4 text-center">
      <div>
        <p className="font-display text-[10rem] leading-none">404</p>
        <p className="text-xl">We can&apos;t find the page you&apos;re looking for.</p>
        <Link href="/" className="mt-6 inline-block rounded-full bg-ink px-6 py-3 font-medium text-paper">
          Back home
        </Link>
      </div>
    </section>
  );
}
