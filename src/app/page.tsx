import { preload } from "react-dom";
import Link from "next/link";
import { Arrow } from "@/components/arrow";
import { BinaryBackground } from "@/components/binary-background";
import { StatueBust } from "@/components/statue-bust";
import { projects } from "@/content/projects";
import { getAllPosts } from "@/lib/posts";

// Kick off the GLB fetch during HTML parse — the bust appears much faster.
preload("/models/rossbandiger.glb", { as: "fetch", crossOrigin: "anonymous" });

export default function HomePage() {
  const featured = projects.slice(0, 3);
  const recentPosts = getAllPosts().slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="relative border-b border-[var(--color-border)]">
        <BinaryBackground />
        <div className="relative mx-auto max-w-6xl px-6 pt-12 pb-24 sm:pt-16 sm:pb-32">
          <h1 className="max-w-3xl text-5xl font-medium leading-[1.05] tracking-tight sm:text-7xl">
            building small,
            <br />
            sharp things on
            <br />
            the <span className="text-[var(--color-accent)]">internet</span>.
          </h1>
          <StatueBust
            width={520}
            height={720}
            model="/models/rossbandiger.glb"
            scale={0.6}
            cameraZ={45}
            className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 lg:block"
          />
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
