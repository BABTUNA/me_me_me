import Link from "next/link";
import { Arrow } from "@/components/arrow";
import { BinaryBackground } from "@/components/binary-background";
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
      <section className="relative border-b border-[var(--color-border)]">
        <BinaryBackground seed={202} />
        <div className="relative mx-auto max-w-6xl px-6 py-28 sm:py-36">
          <div className="num mb-6">/ blog — index</div>
          <h1 className="max-w-3xl text-5xl font-medium leading-[1.05] tracking-tight sm:text-7xl">
            Notes from the
            <br />
            <span className="text-[var(--color-accent)]">workshop</span>.
          </h1>
          <StatueBust
            width={520}
            height={720}
            model="/models/roza-loewenfeld.glb"
            scale={2.2}
            cameraZ={9}
            className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 lg:block"
          />
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
