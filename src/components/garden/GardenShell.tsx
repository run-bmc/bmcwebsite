import Link from "next/link";
import type { ReactNode } from "react";
import { AmbientInsects } from "@/components/garden/AmbientInsects";
import { BackgroundLayer } from "@/components/garden/BackgroundLayer";

type GardenShellProps = {
  children: ReactNode;
  eyebrow?: string;
  title?: string;
  intro?: string;
};

export function GardenShell({ children, eyebrow, title, intro }: GardenShellProps) {
  return (
    <main className="garden-page relative min-h-screen overflow-x-hidden bg-[#08100d] text-[#edf2e7]">
      <AmbientFrame />
      <div className="garden-content relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-8 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/"
              className="garden-nav-pill px-4 py-2.5 text-[11px] font-medium tracking-[0.18em] text-[#f0e8d6] uppercase transition hover:-translate-y-0.5 hover:text-white"
            >
              blakemcdowall.com
            </Link>
            <nav
              aria-label="Garden pages"
              className="flex flex-wrap items-center gap-2 text-[11px] tracking-[0.16em] text-[#d6ddcf] uppercase"
            >
              <GardenNavLink href="/garden">Overview</GardenNavLink>
              <GardenNavLink href="/garden/plants">All Plants</GardenNavLink>
              <GardenNavLink href="/garden/export">Export</GardenNavLink>
            </nav>
          </div>
          {(eyebrow || title || intro) && (
            <div className="garden-surface mx-auto flex w-full max-w-5xl flex-col gap-4 px-5 py-6 text-center sm:px-8 sm:py-8">
              {eyebrow ? (
                <p className="garden-eyebrow text-[11px] text-[#dbe5d1] uppercase">
                  {eyebrow}
                </p>
              ) : null}
              {title ? (
                <h1 className="garden-heading text-balance text-[2.1rem] leading-[1.05] text-[#f7f4ec] sm:text-[3.2rem]">
                  {title}
                </h1>
              ) : null}
              {intro ? (
                <p className="mx-auto max-w-3xl text-pretty text-base leading-7 text-[#e1e6dc] sm:text-[1.05rem]">
                  {intro}
                </p>
              ) : null}
            </div>
          )}
        </header>
        <div className="mx-auto w-full max-w-6xl flex-1">{children}</div>
      </div>
    </main>
  );
}

function GardenNavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="garden-nav-pill px-3 py-2 transition hover:-translate-y-0.5 hover:text-white"
    >
      {children}
    </Link>
  );
}

function AmbientFrame() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <BackgroundLayer />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,8,6,0.48),rgba(4,8,6,0.26)_18%,rgba(4,8,6,0.18)_48%,rgba(4,8,6,0.46)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(12,18,15,0.02),rgba(4,8,6,0.08)_40%,rgba(4,8,6,0.44)_90%)]" />
      <AmbientInsects />
    </div>
  );
}
