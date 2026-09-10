import { preload } from "react-dom";
import Link from "next/link";
import { Arrow } from "@/components/arrow";
import { BinaryBackground } from "@/components/binary-background";
import { StatueBust } from "@/components/statue-bust-lazy";
import { PostCategoryBadge } from "@/components/post-category-badge";
import { projects } from "@/content/projects";
import { getAllPosts } from "@/lib/posts";
import { formatDate } from "@/lib/format-date";

preload("/models/apollo.glb", { as: "fetch", crossOrigin: "anonymous" });

export default function HomePage() {
  const recentPosts = getAllPosts().slice(0, 3);
  const selectedProjects = projects.filter((project) => project.featured);

  return (
    <>
      <section className="home-hero border-b border-[var(--color-border)]">
        <div className="home-hero-grid mx-auto max-w-6xl px-6">
          <div className="hero-copy">
            <p className="eyebrow">Ben Barrera · Software engineer</p>
            <h1 className="hero-title">
              I build stuff
              <br />
              <span className="text-[var(--color-accent)]">sometimes</span>.
            </h1>
            <p className="hero-description">
              I&apos;m Ben, a CS student at USF and five-time SWE intern. I work
              on distributed systems, backend services, and the infrastructure
              that keeps data moving.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link href="/work" className="primary-link">
                Explore my work <Arrow />
              </Link>
              <Link href="/blog" className="arrow-link py-3 text-sm font-medium">
                Read the blog <Arrow />
              </Link>
            </div>
            <Link href="/about#contact" className="hero-contact">
              Have something in mind? Let&apos;s talk <span aria-hidden>↗</span>
            </Link>
          </div>
          <div className="hero-art" aria-hidden="true">
            <BinaryBackground />
            <StatueBust
              priority
              width="100%"
              height="100%"
              model="/models/apollo.glb"
              scale={3.2}
              cameraZ={9}
              effects={false}
              className="absolute inset-0"
            />
          </div>
        </div>
        <div className="focus-strip mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-6 py-5">
          <span className="eyebrow">What I work on</span>
          <span>Distributed systems</span>
          <span>Data infrastructure</span>
          <span>Developer tools</span>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20" aria-labelledby="selected-work">
        <div className="section-heading">
          <div>
            <p className="eyebrow mb-3">Projects & experiments</p>
            <h2 id="selected-work" className="text-3xl font-medium tracking-tight">A few things I&apos;ve built.</h2>
          </div>
          <Link href="/work" className="arrow-link shrink-0 py-3 text-sm">All work <Arrow /></Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {selectedProjects.map((project) => (
            <Link key={project.slug} href={project.href ?? `/work#${project.slug}`} className="project-preview group">
              <div className="mb-8 flex items-center justify-between">
                <span className="num">{project.year} / {project.category}</span>
                <Arrow variant="accent" />
              </div>
              <h3 className="text-2xl font-medium tracking-tight">{project.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">{project.summary}</p>
              <ul className="mt-auto flex flex-wrap gap-2 pt-7" aria-label="Technologies">
                {project.tags.map((tag) => <li key={tag} className="tech-tag">{tag}</li>)}
              </ul>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--color-border)]" aria-labelledby="recent-writing">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="section-heading">
            <div>
              <p className="eyebrow mb-3">From the blog</p>
              <h2 id="recent-writing" className="text-3xl font-medium tracking-tight">Notes from the work.</h2>
            </div>
            <Link href="/blog" className="arrow-link shrink-0 py-3 text-sm">All posts <Arrow /></Link>
          </div>
          {recentPosts.length === 0 ? (
            <p className="text-sm text-[var(--color-fg-muted)]">No posts yet. Coming soon.</p>
          ) : (
            <ul className="writing-grid grid gap-6 sm:grid-cols-3">
              {recentPosts.map((post) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className="writing-preview">
                    <div className="mb-5 flex flex-wrap items-center gap-3">
                      <PostCategoryBadge category={post.category} />
                      <time className="num" dateTime={post.date}>{formatDate(post.date)}</time>
                    </div>
                    <h3 className="text-lg font-medium leading-snug tracking-tight">{post.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">{post.summary}</p>
                    <span className="mt-auto flex items-center gap-2 pt-6 text-sm">Read post <Arrow variant="accent" /></span>
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
