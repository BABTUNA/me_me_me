import { preload } from "react-dom";
import Link from "next/link";
import { Arrow } from "@/components/arrow";
import { BinaryBackground } from "@/components/binary-background";
import { StatueBust } from "@/components/statue-bust-lazy";
import { PostCategoryBadge } from "@/components/post-category-badge";
import { getAllPosts } from "@/lib/posts";

// Kick off the GLB fetch during HTML parse — the bust appears much faster.
preload("/models/apollo.glb", { as: "fetch", crossOrigin: "anonymous" });

export default function HomePage() {
  const recentPosts = getAllPosts().slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[var(--color-border)]">
        <BinaryBackground />
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
              I build stuff
              <br />
              <span className="text-[var(--color-accent)]">sometimes</span>.
            </h1>
            <p className="mt-8 max-w-xl text-base text-[var(--color-fg)] sm:text-lg">
              I&apos;m Ben, a CS student at USF and software engineer co-op at
              Leidos. I build backend systems, ship side projects, and write
              about how things work.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              <Link href="/blog" className="arrow-link font-medium">
                Read the blog <Arrow variant="accent" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* RECENT WRITING */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <div className="num mb-2">/ 03 writing</div>
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
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <PostCategoryBadge category={post.category} />
                      <span className="num">{post.date}</span>
                    </div>
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
