import Link from "next/link";
import { Arrow } from "./arrow";

const socials = [
  { href: "https://github.com/BABTUNA", label: "GitHub" },
  { href: "https://x.com/", label: "X" },
  { href: "https://www.linkedin.com/", label: "LinkedIn" },
  { href: "mailto:benbarrera13@gmail.com", label: "Email" },
];

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="num mb-2">/ contact</div>
            <a
              href="mailto:benbarrera13@gmail.com"
              className="arrow-link text-lg font-medium"
            >
              benbarrera13@gmail.com <Arrow variant="accent" />
            </a>
          </div>

          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--color-fg-muted)]">
            {socials.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="transition-colors hover:text-[var(--color-fg)]"
              >
                {s.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex items-center justify-between text-xs text-[var(--color-fg-dim)]">
          <span className="font-mono">© {new Date().getFullYear()} ben barrera</span>
          <span className="font-mono">built with next.js</span>
        </div>
      </div>
    </footer>
  );
}
