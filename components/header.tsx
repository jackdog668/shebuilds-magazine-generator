import Link from "next/link";
import { brand } from "@/lib/brand";

export function Header() {
  return (
    <header className="border-b border-cream/[0.06]">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 lg:px-10">
        <Link href="/" className="group flex items-baseline gap-3">
          <span className="font-display text-xl tracking-tight">
            <span className="text-foil">SheBuilds</span>{" "}
            <span className="text-cream-muted font-normal">{brand.toolNoun}</span>
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-xs">
          <a
            href={brand.links.home}
            className="font-mono uppercase tracking-[0.16em] text-cream-muted transition-colors hover:text-cream"
          >
            All tools
          </a>
          <a
            href={brand.links.school}
            target="_blank"
            rel="noreferrer"
            className="font-mono uppercase tracking-[0.16em] text-gold transition-colors hover:text-gold-light"
          >
            The School ↗
          </a>
        </nav>
      </div>
      <div className="gold-rule" />
    </header>
  );
}
