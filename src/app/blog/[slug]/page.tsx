import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { Arrow } from "@/components/arrow";
import { PostCategoryBadge } from "@/components/post-category-badge";
import { getAllPosts, getPost } from "@/lib/posts";
import { BlogImage, DriveEmbed, YouTube } from "@/components/mdx-media";
import { useMDXComponents } from "../../../../mdx-components";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.meta.title,
    description: post.meta.summary,
  };
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const components = useMDXComponents({
    BlogImage,
    YouTube,
    DriveEmbed,
  });

  return (
    <article className="mx-auto max-w-2xl px-6 py-20">
      <Link
        href="/blog"
        className="arrow-link text-xs text-[var(--color-fg-muted)] [&>svg]:rotate-180"
      >
        <Arrow /> back to blog
      </Link>

      <header className="mt-10 border-b border-[var(--color-border)] pb-10">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <PostCategoryBadge category={post.meta.category} />
          <span className="num">{formatDate(post.meta.date)}</span>
        </div>
        <h1 className="text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
          {post.meta.title}
        </h1>
        {post.meta.summary && (
          <p className="mt-4 text-lg text-[var(--color-fg-muted)]">
            {post.meta.summary}
          </p>
        )}
      </header>

      <div className="mt-2">
        <MDXRemote
          source={post.content}
          components={components}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
            },
          }}
        />
      </div>

      <footer className="mt-20 border-t border-[var(--color-border)] pt-8">
        <Link href="/blog" className="arrow-link text-sm">
          more posts <Arrow variant="accent" />
        </Link>
      </footer>
    </article>
  );
}
