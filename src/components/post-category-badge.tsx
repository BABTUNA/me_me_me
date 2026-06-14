import { getCategoryLabel } from "@/lib/blog-categories";

type PostCategoryBadgeProps = {
  category?: string;
  className?: string;
};

export function PostCategoryBadge({
  category,
  className = "",
}: PostCategoryBadgeProps) {
  const label = getCategoryLabel(category);
  if (!label) return null;

  return (
    <span
      className={`inline-block border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[var(--color-accent)] ${className}`}
    >
      {label}
    </span>
  );
}
