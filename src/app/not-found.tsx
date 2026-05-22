import Link from "next/link";
import { Arrow } from "@/components/arrow";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-6xl flex-col justify-center px-6 py-20">
      <div className="num mb-6">/ 404 — not found</div>
      <h1 className="text-5xl font-medium tracking-tight sm:text-7xl">
        Nothing here.
      </h1>
      <p className="mt-6 max-w-md text-[var(--color-fg-muted)]">
        The page you&apos;re looking for doesn&apos;t exist, or it once did and
        has since wandered off.
      </p>
      <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm">
        <Link href="/" className="arrow-link font-medium">
          back home <Arrow variant="accent" />
        </Link>
        <Link
          href="/blog"
          className="arrow-link text-[var(--color-fg-muted)]"
        >
          read the blog <Arrow />
        </Link>
      </div>
    </section>
  );
}
