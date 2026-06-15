import { getAuthorship } from "@/lib/blog-categories";

type AuthorshipBadgeProps = {
  authorship?: string;
  className?: string;
};

export function AuthorshipBadge({
  authorship,
  className = "",
}: AuthorshipBadgeProps) {
  const meta = getAuthorship(authorship);
  if (!meta) return null;

  return (
    <span
      title={meta.description || undefined}
      className={`inline-flex items-center gap-1.5 border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-muted)] ${className}`}
    >
      <span
        className="inline-block h-1.5 w-1.5"
        style={{ background: meta.dot }}
        aria-hidden
      />
      {meta.label}
    </span>
  );
}
