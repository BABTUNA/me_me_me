import { preload } from "react-dom";
import Link from "next/link";
import { Arrow } from "@/components/arrow";
import { BinaryBackground } from "@/components/binary-background";
import { StatueBust } from "@/components/statue-bust";
import { projects } from "@/content/projects";

preload("/models/apollo.glb", { as: "fetch", crossOrigin: "anonymous" });

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
      <section className="relative border-b border-[var(--color-border)]">
        <BinaryBackground seed={101} />
        <div className="relative mx-auto max-w-6xl px-6 pt-12 pb-24 sm:pt-16 sm:pb-32">
          <h1 className="max-w-3xl text-5xl font-medium leading-[1.05] tracking-tight sm:text-7xl">
            Things I&apos;ve built,
            <br />
            broken, and
            <br />
            <span className="text-[var(--color-accent)]">shipped</span>.
          </h1>
          <StatueBust
            width={520}
            height={720}
            model="/models/apollo.glb"
            scale={2.4}
            cameraZ={9}
            className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 lg:block"
          />
          <p className="mt-6 max-w-xl text-[var(--color-fg-muted)]">
            A running list of side projects, contributions, and experiments.
            Some are live, some are in progress, some are gracefully archived.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-16">
          <ul className="grid gap-px bg-[var(--color-border)] sm:grid-cols-2">
            {projects.map((p, i) => (
              <li
                key={p.slug}
                id={p.slug}
                className="bg-[var(--color-bg)]"
              >
                <article className="flex h-full flex-col p-8">
                  <div className="mb-6 flex items-start justify-between">
                    <span className="num">
                      {String(i + 1).padStart(2, "0")} / {p.year}
                    </span>
                    {p.status && (
                      <span className="num flex items-center gap-2">
                        <span
                          className={`inline-block h-1.5 w-1.5 rounded-full ${
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
                        view project <Arrow variant="accent" />
                      </Link>
                    ) : (
                      <span className="text-xs text-[var(--color-fg-dim)] font-mono">
                        link coming soon
                      </span>
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
