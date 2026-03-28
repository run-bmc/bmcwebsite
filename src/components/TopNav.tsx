import Link from "next/link";
import { siteConfig } from "@/config/site";

export function TopNav() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-20 px-4 py-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-1 py-1">
        <span className="pointer-events-auto text-sm font-medium tracking-[0.24em] text-stone-100 uppercase">
          {siteConfig.name}
        </span>
        <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-1 sm:gap-3">
          <Link
            href="/garden"
            className="rounded-full border border-[#d3c48738] bg-[#d3c48714] px-3 py-1.5 text-[11px] tracking-[0.22em] text-[#efe3ba] uppercase transition hover:bg-[#d3c48722] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-200"
          >
            Garden
          </Link>
          <nav
            aria-label="External profile links"
            className="flex flex-wrap items-center justify-end gap-1 sm:gap-3"
          >
          {siteConfig.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full px-3 py-1.5 text-[11px] tracking-[0.22em] text-stone-300 uppercase transition hover:bg-white/8 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-200"
            >
              {link.label}
            </a>
          ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
