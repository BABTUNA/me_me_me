import Link from "next/link";
import { Arrow } from "@/components/arrow";
import { Globe } from "@/components/globe";
import { projects } from "@/content/projects";
import { getAllPosts } from "@/lib/posts";

export default function HomePage() {
  const featured = projects.slice(0, 3);
  const recentPosts = getAllPosts().slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="relative border-b border-[var(--color-border)]">
        <div className="grid-bg absolute inset-0 pointer-events-none" />
        <div className="relative mx-auto max-w-6xl px-6 py-28 sm:py-36">
          <div className="num mb-6">/ 01 — index</div>
          <h1 className="max-w-3xl text-5xl font-medium leading-[1.05] tracking-tight sm:text-7xl">
            building small,
            <br />
            sharp things on
            <br />
            the <span className="text-[var(--color-accent)]">internet</span>.
          </h1>
          <p className="mt-8 max-w-xl text-base text-[var(--color-fg-muted)] sm:text-lg">
            I&apos;m Ben — engineer, writer, and serial side-project enjoyer.
            This is my workshop, my notebook, and my front door.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <Link href="/work" className="arrow-link font-medium">
              See the work <Arrow variant="accent" />
            </Link>
            <Link
              href="/blog"
              className="arrow-link text-[var(--color-fg-muted)]"
            >
              Read the blog <Arrow />
            </Link>
          </div>
        </div>
      </section>

      {/* GLOBE — interactive dotted world */}
      <section className="relative border-b border-[var(--color-border)] overflow-hidden">
        <div className="grid-bg absolute inset-0 pointer-events-none opacity-40" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:py-28 md:grid-cols-2 md:items-center">
          <div>
            <div className="num mb-6">/ interlude — the world</div>
            <h2 className="text-3xl font-medium leading-tight tracking-tight sm:text-5xl">
              The internet is a
              <br />
              <span className="text-[var(--color-accent)]">small place</span>.
            </h2>
            <p className="mt-6 max-w-md text-[var(--color-fg-muted)]">
              Reachable from anywhere with a connection. I&apos;ve worked with
              people across the world and built things that quietly land on
              other people&apos;s screens at all hours of the day.
            </p>
            <p className="mt-4 max-w-md font-mono text-xs text-[var(--color-fg-dim)]">
              drag to spin · auto-rotates when idle
            </p>
          </div>
          <Globe />
        </div>
      </section>

      {/* FEATURED WORK */}
      <section className="border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <div className="num mb-2">/ 02 — selected work</div>
              <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">
                Recent projects
              </h2>
            </div>
            <Link href="/work" className="arrow-link text-sm">
              all work <Arrow />
            </Link>
          </div>

          <ul className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
            {featured.map((p, i) => (
              <li key={p.slug}>
                <Link
                  href={p.href ?? `/work#${p.slug}`}
                  className="group flex items-center justify-between gap-6 py-6 transition-colors hover:bg-[var(--color-surface)]"
                >
                  <div className="flex items-baseline gap-6 px-2">
                    <span className="num w-8 text-right">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <div className="text-lg font-medium">{p.title}</div>
                      <div className="mt-1 max-w-xl text-sm text-[var(--color-fg-muted)]">
                        {p.summary}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 px-2 text-xs text-[var(--color-fg-dim)]">
                    <span className="font-mono">{p.year}</span>
                    <span className="opacity-0 transition-opacity group-hover:opacity-100">
                      <Arrow variant="accent" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* RECENT WRITING */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <div className="num mb-2">/ 03 — writing</div>
              <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">
                From the blog
              </h2>
            </div>
            <Link href="/blog" className="arrow-link text-sm">
              all posts <Arrow />
            </Link>
          </div>

          {recentPosts.length === 0 ? (
            <p className="text-sm text-[var(--color-fg-muted)]">
              No posts yet. Coming soon.
            </p>
          ) : (
            <ul className="grid gap-px bg-[var(--color-border)] sm:grid-cols-3">
              {recentPosts.map((post) => (
                <li key={post.slug} className="bg-[var(--color-bg)]">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block h-full p-6 transition-colors hover:bg-[var(--color-surface)]"
                  >
                    <div className="num mb-4">{post.date}</div>
                    <div className="text-base font-medium leading-snug">
                      {post.title}
                    </div>
                    <div className="mt-2 text-sm text-[var(--color-fg-muted)]">
                      {post.summary}
                    </div>
                    <div className="mt-6 arrow-link text-xs">
                      read <Arrow />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
