import { preload } from "react-dom";
import Link from "next/link";
import { Arrow } from "@/components/arrow";
import { BinaryBackground } from "@/components/binary-background";
import { StatueBust } from "@/components/statue-bust-lazy";
import { experience } from "@/content/experience";

preload("/models/apollo.glb", { as: "fetch", crossOrigin: "anonymous" });

export const metadata = {
  title: "About",
  description: "Who I am, what I do, and how to reach me.",
};

const facts: { label: string; value: string }[] = [
  { label: "based", value: "Tampa, FL" },
  { label: "role", value: "Software Engineer Intern @ Leidos" },
  { label: "education", value: "USF · BS Computer Science · 3.88 GPA" },
  { label: "graduating", value: "May 2027" },
];

const stack: { label: string; items: string[] }[] = [
  {
    label: "languages",
    items: ["Java", "TypeScript", "Python", "C#", "C++", "SQL"],
  },
  {
    label: "frameworks & tools",
    items: [
      "Spring Boot",
      "React",
      "Next.js",
      "Django",
      "Express",
      "Docker",
      "Kubernetes",
    ],
  },
  {
    label: "infrastructure",
    items: [
      "AWS",
      "Kafka",
      "Apache Beam & Spark",
      "GraphQL",
      "DynamoDB",
      "Azure DevOps",
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[var(--color-border)]">
        <BinaryBackground seed={303} />
        <div className="relative z-10 mx-auto flex min-h-[20rem] max-w-6xl flex-col justify-center px-6 py-14 sm:min-h-[24rem]">
          <StatueBust
            priority
            width="clamp(280px, 48vw, 600px)"
            height="100%"
            model="/models/apollo.glb"
            scale={3.2}
            cameraZ={9}
            className="pointer-events-none absolute inset-y-0 -right-6 z-0 opacity-20 sm:right-0 sm:opacity-40 lg:opacity-100"
          />
          <div className="relative z-10">
            <h1 className="max-w-3xl text-5xl font-medium leading-[1.05] tracking-tight sm:text-7xl">
              Hi, I&apos;m Ben.
              <br />
              <span className="text-[var(--color-accent)]">
                I build things.
              </span>
            </h1>
          </div>
        </div>
      </section>

      {/* BIO + FACTS */}
      <section className="border-b border-[var(--color-border)]">
        <div className="mx-auto grid max-w-6xl gap-px bg-[var(--color-border)] px-0 sm:grid-cols-3">
          <div className="bg-[var(--color-bg)] p-8 sm:col-span-2">
            <div className="num mb-6">/ 01 bio</div>
            <div className="space-y-5 text-[var(--color-fg)] leading-relaxed">
              <p>
                I&apos;m a Computer Science student at the University of South
                Florida (GPA 3.88, expected graduation May 2027) and a Software
                Engineer Intern (Co-op) at Leidos in St. Petersburg, FL.
              </p>
              <p>
                I contribute to Java based backend services for an operational
                readiness platform monitoring military equipment health and fault
                status. I&apos;ve also interned at Gradual, Bill, and Bentley
                Systems, working on backend APIs, event pipelines, AI agents, and
                cloud infrastructure.
              </p>
              <p>
                As Technology Lead for the USF ColorStack Chapter, I coordinated
                tech curriculum and presented 4 workshops to over 150 students
                teaching data structures and algorithms, backend (Django),
                frontend (React), and cloud deployment (AWS).
              </p>
            </div>
          </div>

          <aside className="bg-[var(--color-bg)] p-8">
            <div className="num mb-6">/ 02 facts</div>
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

      {/* EXPERIENCE */}
      <section className="border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="num mb-8">/ 03 experience</div>
          <ul className="mx-auto max-w-2xl divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
            {experience.map((job) => (
              <li key={job.company} className="py-8">
                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h2 className="text-lg font-medium">{job.role}</h2>
                    <span className="font-mono text-xs text-[var(--color-fg-dim)]">
                      {job.period}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-fg-muted)]">
                    {job.company} · {job.location}
                  </p>
                </div>
                <ul className="mt-4 space-y-3">
                  {job.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--color-fg-muted)]"
                    >
                      <span className="mt-2 inline-block h-1 w-1 shrink-0 bg-[var(--color-accent)]" />
                      {h}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* STACK */}
      <section className="border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="num mb-8">/ 04 stack</div>
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
          <div className="num mb-6">/ 05 say hi</div>
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
            <Link
              href="https://www.linkedin.com/in/benbarreraA/"
              className="arrow-link text-sm text-[var(--color-fg-muted)]"
            >
              linkedin <Arrow />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
