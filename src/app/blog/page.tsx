import Link from "next/link";
import { Arrow } from "@/components/arrow";
import { StatueBust } from "@/components/statue-bust";
import { getAllPosts } from "@/lib/posts";

export const metadata = {
  title: "Blog",
  description: "Notes, essays, and short writing.",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      <section className="border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="num mb-6">/ blog — index</div>
          <div className="flex items-start gap-6 sm:gap-10">
            <h1 className="max-w-3xl flex-1 text-4xl font-medium tracking-tight sm:text-6xl">
              Notes from the
              <br />
              <span className="text-[var(--color-accent)]">workshop</span>.
            </h1>
            <StatueBust size={160} className="hidden shrink-0 sm:block" />
          </div>
          <p className="mt-6 max-w-xl text-[var(--color-fg-muted)]">
            Essays, debugging stories, and short notes. Roughly in reverse
            chronological order — newest at the top.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-16">
          {posts.length === 0 ? (
            <div className="border border-dashed border-[var(--color-border-strong)] p-10 text-center text-sm text-[var(--color-fg-muted)]">
              No posts yet. Stay tuned.
            </div>
          ) : (
            <ul className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
              {posts.map((post, i) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group grid grid-cols-[3rem_8rem_1fr_auto] items-baseline gap-6 px-2 py-6 transition-colors hover:bg-[var(--color-surface)]"
                  >
                    <span className="num">
                      {String(posts.length - i).padStart(2, "0")}
                    </span>
                    <span className="num">{formatDate(post.date)}</span>
                    <div>
                      <div className="text-lg font-medium leading-snug">
                        {post.title}
                      </div>
                      <div className="mt-1 max-w-2xl text-sm text-[var(--color-fg-muted)]">
                        {post.summary}
                      </div>
                    </div>
                    <span className="opacity-0 transition-opacity group-hover:opacity-100">
                      <Arrow variant="accent" />
                    </span>
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
