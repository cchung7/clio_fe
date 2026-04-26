import Link from "next/link";

export default function HomePage() {
  return (
    <main className="clio-app-shell min-h-screen">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-center">
        <p className="clio-badge clio-badge-gold mb-4">Clio v0.1</p>

        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-[var(--clio-ink)] sm:text-6xl">
          Diagram-first documentation for evolving software systems.
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--clio-muted)] sm:text-lg">
          Build lightweight architecture views, requirements, design notes, and
          evolution history from an interactive system map.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/builder"
            className="clio-btn-primary rounded-xl px-5 py-3 text-sm font-semibold shadow-sm transition"
          >
            Open Builder
          </Link>
        </div>
      </section>
    </main>
  );
}