import Link from "next/link";

import { HeroBackgroundSlideshow } from "./HeroBackgroundSlideshow";

export function HomePageHero() {
  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[var(--clio-paper)]">
      <HeroBackgroundSlideshow />

      <section className="relative z-10 mx-auto flex min-h-[100svh] max-w-5xl flex-col items-center justify-center px-5 py-16 text-center sm:px-6 lg:px-8">
        <p className="clio-badge clio-badge-gold mb-4 text-[0.68rem] sm:text-xs">
          Clio
        </p>

        <h1 className="max-w-[19rem] text-4xl font-semibold leading-[1.05] tracking-tight text-[var(--clio-ink)] sm:max-w-3xl sm:text-5xl md:text-6xl lg:text-6xl">
          Diagram-first documentation for evolving software systems.
        </h1>

        <p className="mt-5 max-w-[20rem] text-sm leading-6 text-[var(--clio-muted)] sm:mt-6 sm:max-w-2xl sm:text-base sm:leading-7 md:text-lg">
          Build lightweight architecture views, requirements, design notes, and
          evolution history from an interactive system map.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-3 sm:mt-8">
          <Link
            href="/builder"
            className="clio-btn-primary rounded-xl px-5 py-3 text-sm font-semibold shadow-sm transition"
          >
            Open Canvas
          </Link>
        </div>
      </section>
    </main>
  );
}