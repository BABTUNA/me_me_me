import { preload } from "react-dom";
import Link from "next/link";
import { Arrow } from "@/components/arrow";
import { BinaryBackground } from "@/components/binary-background";
import { StatueBust } from "@/components/statue-bust";

preload("/models/apollo.glb", { as: "fetch", crossOrigin: "anonymous" });

export const metadata = {
  title: "About",
  description: "Who I am, what I do, and how to reach me.",
};

const facts: { label: string; value: string }[] = [
  { label: "based", value: "somewhere on Earth" },
  { label: "role", value: "engineer / builder" },
  { label: "stack", value: "ts · python · go" },
  { label: "interests", value: "tools, systems, prose" },
];

const stack: { label: string; items: string[] }[] = [
  {
    label: "everyday",
    items: ["TypeScript", "Python", "PostgreSQL", "Tailwind", "Next.js"],
  },
  {
    label: "comfortable",
    items: ["Go", "Rust", "Docker", "FastAPI", "Redis"],
  },
  {
    label: "exploring",
    items: ["LLM tooling", "Edge runtimes", "DSP"],
  },
];

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative border-b border-[var(--color-border)]">
        <BinaryBackground seed={303} />
        <div className="relative mx-auto max-w-6xl px-6 pt-12 pb-24 sm:pt-16 sm:pb-32">
          <h1 className="max-w-3xl text-5xl font-medium leading-[1.05] tracking-tight sm:text-7xl">
            Hi, I&apos;m Ben.
            <br />
            <span className="text-[var(--color-accent)]">
              I build things.
            </span>
          </h1>
          <StatueBust
            width={520}
            height={720}
            model="/models/apollo.glb"
            scale={2.4}
            cameraZ={9}
            className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 lg:block"
          />
        </div>
      </section>

      {/* BIO + FACTS */}
      <section className="border-b border-[var(--color-border)]">
        <div className="mx-auto grid max-w-6xl gap-px bg-[var(--color-border)] px-0 sm:grid-cols-3">
          <div className="bg-[var(--color-bg)] p-8 sm:col-span-2">
            <div className="num mb-6">/ 01 — bio</div>
            <div className="space-y-5 text-[var(--color-fg)] leading-relaxed">
              <p>
                I&apos;m an engineer who likes building small, sharp tools and
                writing about how they work. Most of my time goes into product
                engineering — backend systems, web apps, and the occasional
                weird side project.
              </p>
              <p>
                I care about{" "}
                <span className="text-[var(--color-accent)]">
                  craft, clarity, and shipping
                </span>
                . I&apos;d rather build one thing that works than five things
                that almost do. I think tools should feel obvious, and I think
                obvious is hard.
              </p>
              <p>
                Outside of work I&apos;m usually reading, lifting, listening
                to music too loud, or arguing with a terminal.
              </p>
            </div>
          </div>

          <aside className="bg-[var(--color-bg)] p-8">
            <div className="num mb-6">/ 02 — facts</div>
            <dl className="space-y-4">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-dim)]">
                    {f.label}
                  </dt>
                  <dd className="mt-1 text-sm">{f.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      {/* STACK */}
      <section className="border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="num mb-8">/ 03 — stack</div>
          <div className="grid gap-8 sm:grid-cols-3">
            {stack.map((s) => (
              <div key={s.label}>
                <div className="mb-3 font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-dim)]">
                  {s.label}
                </div>
                <ul className="space-y-1.5">
                  {s.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span className="inline-block h-1 w-1 bg-[var(--color-accent)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="num mb-6">/ 04 — say hi</div>
          <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
            Want to talk?
          </h2>
          <p className="mt-4 max-w-xl text-[var(--color-fg-muted)]">
            Drop a line if you&apos;re building something interesting, want to
            collaborate, or just feel like saying hello.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
            <a
              href="mailto:benbarrera13@gmail.com"
              className="arrow-link text-lg font-medium"
            >
              benbarrera13@gmail.com <Arrow variant="accent" />
            </a>
            <Link
              href="https://github.com/BABTUNA"
              className="arrow-link text-sm text-[var(--color-fg-muted)]"
            >
              github <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
