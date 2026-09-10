import Link from "next/link";
import { Arrow } from "@/components/arrow";
import { projects } from "@/content/projects";

export const metadata = {
  title: "Work",
  description: "Projects, experiments, and things shipped.",
};

const statusLabel: Record<string, string> = {
  shipped: "shipped",
  wip: "in progress",
  archived: "archived",
};

export default function WorkPage() {
  return (
    <>
      <section className="grid-bg relative overflow-hidden border-b border-[var(--color-border)]">
        <div className="relative z-10 mx-auto flex min-h-[16rem] max-w-6xl flex-col justify-center px-6 py-14 sm:min-h-[20rem]">
          <div className="relative z-10">
            <h1 className="max-w-3xl text-5xl font-medium leading-[1.05] tracking-tight sm:text-7xl">
              Things I&apos;ve built,
              <br />
              broken, and
              <br />
              <span className="text-[var(--color-accent)]">shipped</span>.
            </h1>
            <p className="mt-6 max-w-xl text-[var(--color-fg)]">
              Side projects, open-source contributions, and experiments in
              systems, data, and software that helps people learn.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-16">
          <ul className="grid gap-px bg-[var(--color-border)] sm:grid-cols-2">
            {projects.map((p) => (
              <li
                key={p.slug}
                id={p.slug}
                className="bg-[var(--color-bg)]"
              >
                <article className="flex h-full flex-col p-6 sm:p-8">
                  <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                    <span className="num">
                      {p.year}{p.category ? ` / ${p.category}` : ""}
                    </span>
                    {p.status && (
                      <span className="num flex items-center gap-2">
                        <span
                          className={`inline-block h-1.5 w-1.5 ${
                            p.status === "shipped"
                              ? "bg-[var(--color-accent)]"
                              : p.status === "wip"
                                ? "bg-yellow-400"
                                : "bg-[var(--color-fg-dim)]"
                          }`}
                        />
                        {statusLabel[p.status]}
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl font-medium tracking-tight">
                    {p.title}
                  </h2>
                  <p className="mt-3 text-sm text-[var(--color-fg-muted)]">
                    {p.summary}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="border border-[var(--color-border-strong)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-muted)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-8">
                    {p.href ? (
                      <Link
                        href={p.href}
                        className="arrow-link text-sm font-medium"
                      >
                        {p.linkLabel ?? "View project"} <Arrow variant="accent" />
                      </Link>
                    ) : (
                      <Link href="/about#contact" className="arrow-link text-sm text-[var(--color-fg-muted)]">
                        Ask me about this <Arrow />
                      </Link>
                    )}
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
