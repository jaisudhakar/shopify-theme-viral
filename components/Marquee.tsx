import { cx } from "@/lib/format";

export function Marquee({
  items,
  className,
  duration = 30,
  reverse = false,
}: {
  items: string[];
  className?: string;
  duration?: number;
  reverse?: boolean;
}) {
  const row = (hidden?: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="px-6">{item}</span>
          <span className="text-[0.6em]">✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className={cx("flex overflow-hidden whitespace-nowrap", className)}>
      <div
        className="flex animate-marquee"
        style={{ "--marquee-duration": `${duration}s`, animationDirection: reverse ? "reverse" : undefined } as React.CSSProperties}
      >
        {row()}
        {row(true)}
      </div>
    </div>
  );
}
