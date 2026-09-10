import { formatDate } from "@/lib/format-date";
import Link from "next/link";
import { Arrow } from "@/components/arrow";
import { PostCategoryBadge } from "@/components/post-category-badge";
import { AuthorshipBadge } from "@/components/authorship-badge";
import { ViewCounter } from "@/components/view-counter";
import { AUTHORSHIP } from "@/lib/blog-categories";
import { getAllPosts } from "@/lib/posts";

export const metadata = {
  title: "Blog",
  description: "Notes, essays, and short writing.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      <section className="grid-bg relative overflow-hidden border-b border-[var(--color-border)]">
        <div className="relative z-10 mx-auto flex min-h-[16rem] max-w-6xl flex-col justify-center px-6 py-14 sm:min-h-[20rem]">
          <div className="relative z-10">
            <h1 className="max-w-3xl text-5xl font-medium leading-[1.05] tracking-tight sm:text-7xl">
              Notes from the
              <br />
              <span className="text-[var(--color-accent)]">workshop</span>.
            </h1>
            <p className="mt-6 max-w-xl text-[var(--color-fg)]">
              Essays, debugging stories, and short notes. Roughly in reverse
              chronological order, newest at the top.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-16">
          {posts.length === 0 ? (
            <div className="border border-dashed border-[var(--color-border-strong)] p-10 text-center text-sm text-[var(--color-fg-muted)]">
              No posts yet. Stay tuned.
            </div>
          ) : (
            <>
              <div className="mb-8 flex flex-col gap-2 border border-[var(--color-border)] bg-[var(--color-surface)]/40 p-4 text-xs text-[var(--color-fg-muted)]">
                <span className="num mb-1">/ how each post was written</span>
                {Object.values(AUTHORSHIP).map((a) => (
                  <span key={a.label} className="flex items-baseline gap-2">
                    <span
                      className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0"
                      style={{ background: a.dot }}
                      aria-hidden
                    />
                    <span>
                      <span className="font-mono uppercase tracking-wider text-[var(--color-fg)]">
                        {a.label}
                      </span>
                      : {a.description}
                    </span>
                  </span>
                ))}
              </div>
              <ul className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
              {posts.map((post, i) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col gap-3 px-2 py-6 transition-colors hover:bg-[var(--color-surface)] sm:grid sm:grid-cols-[3rem_8rem_1fr_auto] sm:items-baseline sm:gap-6"
                  >
                    <div className="flex items-center gap-3 sm:contents">
                      <span className="num">
                        {String(posts.length - i).padStart(2, "0")}
                      </span>
                      <time className="num" dateTime={post.date}>{formatDate(post.date)}</time>
                    </div>
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <PostCategoryBadge category={post.category} />
                        <AuthorshipBadge authorship={post.authorship} />
                        <ViewCounter slug={post.slug} />
                      </div>
                      <h2 className="text-lg font-medium leading-snug">
                        {post.title}
                      </h2>
                      <div className="mt-1 max-w-2xl text-sm text-[var(--color-fg-muted)]">
                        {post.summary}
                      </div>
                    </div>
                    <span className="hidden opacity-0 transition-opacity group-hover:opacity-100 sm:inline">
                      <Arrow variant="accent" />
                    </span>
                  </Link>
                </li>
              ))}
              </ul>
            </>
          )}
        </div>
      </section>
    </>
  );
}
