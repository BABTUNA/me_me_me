import Link from "next/link";
import { Arrow } from "./arrow";

const socials = [
  { href: "https://github.com/BABTUNA", label: "GitHub" },
  { href: "https://www.linkedin.com/in/benbarreraA/", label: "LinkedIn" },
  { href: "mailto:benbarrera13@gmail.com", label: "Email" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="num mb-2">/ contact</div>
            <a
              href="mailto:benbarrera13@gmail.com"
              className="arrow-link break-all text-base font-medium sm:text-lg"
            >
              benbarrera13@gmail.com <Arrow variant="accent" />
            </a>
          </div>

          <nav aria-label="Social links" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--color-fg-muted)]">
            {socials.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="py-3 transition-colors hover:text-[var(--color-fg)]"
              >
                {s.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-[var(--color-fg-dim)]">
          <span className="font-mono">© {new Date().getFullYear()} ben barrera</span>
          <span className="font-mono">built with next.js</span>
        </div>
      </div>
    </footer>
  );
}
