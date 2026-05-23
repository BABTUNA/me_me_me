import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

const nav = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-sm tracking-tight"
        >
          <span className="inline-block h-2 w-2 bg-[var(--color-accent)]" />
          <span>ben.barrera</span>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-sm px-3 py-1.5 text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
            >
              {item.label}
            </Link>
          ))}
          <span className="mx-2 h-4 w-px bg-[var(--color-border)]" />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
