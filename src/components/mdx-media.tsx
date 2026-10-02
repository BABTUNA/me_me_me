import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/arrow";

type BlogImageProps = {
  src: string;
  alt: string;
  caption?: string;
};

export function BlogImage({ src, alt, caption }: BlogImageProps) {
  return (
    <figure className="my-8">
      <div className="overflow-hidden rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)]">
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={675}
          className="h-auto w-full"
          sizes="(max-width: 768px) 100vw, 672px"
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 text-center text-sm text-[var(--color-fg-muted)]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

type YouTubeProps = {
  id: string;
  title?: string;
};

export function YouTube({ id, title = "YouTube video" }: YouTubeProps) {
  return (
    <figure className="my-8">
      <div className="aspect-video overflow-hidden rounded-sm border border-[var(--color-border)] bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
      <figcaption className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--color-fg-muted)]">
        <span>{title}</span>
        <a
          href={`https://www.youtube.com/watch?v=${id}`}
          className="content-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Watch on YouTube
        </a>
      </figcaption>
    </figure>
  );
}

type DriveEmbedProps = {
  id: string;
  title: string;
  tall?: boolean;
};

export function DriveEmbed({ id, title, tall = false }: DriveEmbedProps) {
  const viewUrl = `https://drive.google.com/file/d/${id}/view?usp=sharing`;
  const previewUrl = `https://drive.google.com/file/d/${id}/preview`;

  return (
    <figure className="my-8">
      <figcaption className="mb-2 text-sm font-medium text-[var(--color-fg)]">
        {title}
      </figcaption>
      <div
        className={`overflow-hidden rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)] ${
          tall ? "min-h-[32rem]" : "aspect-video"
        }`}
      >
        <iframe
          src={previewUrl}
          title={title}
          allow="autoplay"
          className="h-full min-h-[inherit] w-full"
          style={tall ? { minHeight: "32rem" } : undefined}
        />
      </div>
      <a
        href={viewUrl}
        className="content-link mt-3 inline-block text-sm"
        target="_blank"
        rel="noopener noreferrer"
      >
        Open in Google Drive
      </a>
    </figure>
  );
}

type LinkButtonProps = {
  href: string;
  children: React.ReactNode;
  // solid is the main action, outline is a second option next to it
  variant?: "solid" | "outline";
};

// a link that looks like a button, for the things a post wants you to click
// the site's base link rule sets color on every anchor and outranks utility classes,
// so the text color is set inline
export function LinkButton({ href, children, variant = "solid" }: LinkButtonProps) {
  const solid = variant === "solid";
  return (
    <Link
      href={href}
      className={`arrow-link rounded-sm px-5 py-3 font-mono text-sm ${
        solid
          ? "bg-[var(--color-accent)] hover:opacity-90"
          : "border border-[var(--color-border-strong)] hover:border-[var(--color-fg)]"
      }`}
      style={{ color: solid ? "var(--color-on-accent)" : "var(--color-fg)" }}
    >
      {children} <Arrow />
    </Link>
  );
}

// lays out one or more link buttons on a line, wrapping on narrow screens
export function ButtonRow({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 flex flex-wrap gap-3">{children}</div>;
}
